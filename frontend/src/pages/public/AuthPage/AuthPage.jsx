import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

// Local imports
import AuthButtons from "./AuthButtons";

// MUI
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

// Context
import UserContext from "../../../services/UserContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // MSAL instance for Microsoft
  const { instance } = useMsal();

  // Our UI alert system
  const { showSnackbar } = useContext(SnackbarContext);

  // Pull methods from UserContext
  const { login, registerUser, loginWithGoogle, loginWithMicrosoft } =
    useContext(UserContext);

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

  /************************************************
   * Google OAuth success/failure
   ************************************************/
  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      showSnackbar("Google login successful!", "success");
      navigate("/dashboard");
    } else {
      showSnackbar(result.message, "error");
    }
  };

  const handleGoogleError = () => {
    showSnackbar("Google login failed", "error");
  };

  /************************************************
   * Microsoft OAuth
   ************************************************/
  const handleMicrosoftLogin = async () => {
    try {
      // 1) Open a popup for Microsoft sign in
      const response = await instance.loginPopup({ scopes: ["User.Read"] });
      if (response && response.accessToken) {
        // 2) Send token to the backend
        const result = await loginWithMicrosoft(response.accessToken);
        if (result.success) {
          showSnackbar("Microsoft login successful!", "success");
          navigate("/dashboard");
        } else {
          showSnackbar(result.message, "error");
        }
      }
    } catch (error) {
      showSnackbar("Microsoft login failed", "error");
    }
  };

  /************************************************
   * Normal Email/Password
   ************************************************/
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      showSnackbar("Login successful!", "success");
      navigate("/dashboard");
    } else {
      showSnackbar(result.message, "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await registerUser(name, email, password);
    if (result.success) {
      showSnackbar("Registration successful!", "success");
      navigate("/dashboard");
    } else {
      showSnackbar(result.message, "error");
    }
  };

  return (
    <Container maxWidth="xs" sx={{my: {xs: 3, sm: 8}}}>
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

          {/* 
            OAuth Buttons:
            We pass down the handlers for Google & Microsoft 
            so AuthButtons can render them with matching styles.
          */}
          <AuthButtons
            handleGoogleSuccess={handleGoogleSuccess}
            handleGoogleError={handleGoogleError}
            handleMicrosoftLogin={handleMicrosoftLogin}
          />

          {/* Divider for normal email/password or sign-up */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="subtitle2">or</Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          {/* Name field only if registering */}
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

          {/* Email/Password Fields */}
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

          {/* Submit Button */}
          <Button fullWidth type="submit" variant="contained" color="primary">
            {isLogin ? "Login" : "Register"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AuthPage;
