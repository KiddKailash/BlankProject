import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

// Local imports
import AuthButtons from "./AuthButtons";

// MUI Components
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

// Contexts
import UserContext from "../../../services/UserContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { instance } = useMsal();

  // Context hooks
  const { showSnackbar } = useContext(SnackbarContext);
  const {
    login,
    registerUser,
    loginWithGoogle,
    loginWithMicrosoft,
    isLoggedIn,
    user,
  } = useContext(UserContext);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, user, navigate]);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Determine login/register mode
  const mode = new URLSearchParams(location.search).get("mode");
  const isLogin = mode === "login";

  const toggleModeUrl = () => {
    const newMode = isLogin ? "register" : "login";
    navigate(`?mode=${newMode}`);
  };

  // OAuth handlers
  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      showSnackbar("Successfully logged in with Google!", "success");
      navigate("/dashboard");
    } else {
      showSnackbar(result.message || "Failed to login with Google", "error");
    }
  };

  const handleGoogleError = () => {
    showSnackbar("Google login failed", "error");
  };

  const handleMicrosoftLogin = async () => {
    try {
      const response = await instance.loginPopup({ scopes: ["User.Read"] });
      if (response?.accessToken) {
        const result = await loginWithMicrosoft(response.accessToken);
        if (result.success) {
          showSnackbar("Successfully logged in with Microsoft!", "success");
          navigate("/dashboard");
        } else {
          showSnackbar(
            result.message || "Failed to login with Microsoft",
            "error"
          );
        }
      }
    } catch (error) {
      showSnackbar("Microsoft login failed", "error");
    }
  };

  // Form handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      showSnackbar("Login successful!", "success");
      navigate("/dashboard");
    } else {
      showSnackbar(result.message || "Login failed", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await registerUser(name, email, password);
    if (result.success) {
      showSnackbar("Registration successful!", "success");
      navigate("/dashboard");
    } else {
      showSnackbar(result.message || "Registration failed", "error");
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

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={!email || !password || (!isLogin && !name)}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AuthPage;
