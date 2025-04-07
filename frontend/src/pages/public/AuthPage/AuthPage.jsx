import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

// Local import
import AuthButtons from "./AuthButtons";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

// Context for toast/snackbar messages
import { SnackbarContext } from "../../../contexts/SnackbarContext";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { instance } = useMsal();
  const { showSnackbar } = useContext(SnackbarContext);

  // Determine if in login mode or register mode
  const mode = new URLSearchParams(location.search).get("mode");
  const isLogin = mode === "login";

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Toggle between "login" and "register"
  const toggleModeUrl = () => {
    const newMode = isLogin ? "register" : "login";
    navigate(`?mode=${newMode}`);
  };

  // OAuth success handlers
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:8000/teachers/google-auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        showSnackbar("Google login successful!", "success");
        navigate("/dashboard");
      } else {
        showSnackbar("Google login failed", "error");
      }
    } catch (error) {
      showSnackbar("Google login failed", "error");
    }
  };

  const handleGoogleError = () => {
    showSnackbar("Google login failed", "error");
  };

  const handleMicrosoftLogin = async (response) => {
    try {
      if (response.accessToken) {
        const msAuthResponse = await fetch("http://localhost:8000/teachers/microsoft-auth/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.accessToken }),
        });

        const data = await msAuthResponse.json();
        if (msAuthResponse.ok) {
          localStorage.setItem("access_token", data.access);
          showSnackbar("Microsoft login successful!", "success");
          navigate("/dashboard");
        } else {
          showSnackbar("Microsoft login failed", "error");
        }
      }
    } catch (error) {
      showSnackbar("Microsoft login failed", "error");
    }
  };

  // Normal Email/Password Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/teachers/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        showSnackbar("Login successful!", "success");
        navigate("/dashboard");
      } else {
        showSnackbar(data?.message || "Login failed", "error");
      }
    } catch (error) {
      showSnackbar("Login failed", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/teachers/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        showSnackbar("Registration successful!", "success");
        navigate("/dashboard");
      } else {
        showSnackbar(data?.message || "Registration failed", "error");
      }
    } catch (error) {
      showSnackbar("Registration failed", "error");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ my: { xs: 3, sm: 8 } }}>
      <Box
        component="form"
        noValidate
        onSubmit={isLogin ? handleLogin : handleRegister}
        sx={(theme) => ({
          padding: theme.spacing(4),
          marginTop: theme.spacing(4),
          bgcolor: theme.palette.background.paper,
          borderRadius: theme.shape.border,
        })}
      >
        <Stack direction="column" spacing={1.5}>
          <Typography variant="h4" align="center" gutterBottom>
            {isLogin ? "Sign in to Account" : "Register Account"}
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <Link
                  color="primary"
                  onClick={toggleModeUrl}
                  sx={{ cursor: "pointer" }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  color="primary"
                  onClick={toggleModeUrl}
                  sx={{ cursor: "pointer" }}
                >
                  Login
                </Link>
              </>
            )}
          </Typography>

          <AuthButtons
            handleGoogleSuccess={handleGoogleSuccess}
            handleGoogleError={handleGoogleError}
            handleMicrosoftLogin={handleMicrosoftLogin}
            msalInstance={instance}
          />

          <Stack direction="row" alignItems="center" spacing={2}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="subtitle2">or</Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          {!isLogin && (
            <TextField
              fullWidth
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />

          <Button fullWidth type="submit" variant="contained" color="primary">
            {isLogin ? "Login" : "Register"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AuthPage;
