import React, { useState, useContext } from "react";
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

/**
 * AuthPage Component
 *
 * This component renders an authentication page that supports both login and registration.
 * It enables OAuth login through Google and Microsoft, as well as normal email/password authentication.
 * It also provides UI feedback via the Snackbar alert system.
 *
 * The mode (login/register) is determined by the query parameter "mode".
 *
 * @component
 * @returns {JSX.Element} The authentication page component.
 */
const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { instance } = useMsal(); // MSAL instance for Microsoft OAuth

  // Retrieve global UI alert function
  const { showSnackbar } = useContext(SnackbarContext);

  // Retrieve authentication-related functions from UserContext
  const { login, registerUser, loginWithGoogle, loginWithMicrosoft } =
    useContext(UserContext);

  // Determine current mode (login or register) based on URL query parameters
  const mode = new URLSearchParams(location.search).get("mode");
  const isLogin = mode === "login";

  // Form state hooks for email, password, and name (registration only)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  /**
   * toggleModeUrl
   *
   * Toggles the URL query parameter between "login" and "register".
   */
  const toggleModeUrl = () => {
    const newMode = isLogin ? "register" : "login";
    navigate(`?mode=${newMode}`);
  };

  /************************************************
   * Google OAuth Handlers
   ************************************************/

  /**
   * handleGoogleSuccess
   *
   * Callback for successful Google OAuth login. Processes the credential,
   * attempts to log in via Google, shows a success or error snackbar, and navigates to the dashboard.
   *
   * @param {object} credentialResponse - Response from Google containing the JWT credential.
   */
  const handleGoogleSuccess = async (credentialResponse) => {
    // Call the context function to perform Google login
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      showSnackbar("Google login successful!", "success");
      navigate("/dashboard");
    } else {
      showSnackbar(result.message, "error");
    }
  };

  /**
   * handleGoogleError
   *
   * Callback for handling errors during Google OAuth login.
   */
  const handleGoogleError = () => {
    showSnackbar("Google login failed", "error");
  };

  /************************************************
   * Microsoft OAuth Handler
   ************************************************/

  /**
   * handleMicrosoftLogin
   *
   * Initiates Microsoft OAuth login using MSAL's popup method. After successful authentication,
   * it sends the access token to the backend, displays appropriate snackbar messages,
   * and navigates to the dashboard.
   */
  const handleMicrosoftLogin = async () => {
    try {
      // Open a popup for Microsoft sign in, requesting the "User.Read" scope.
      const response = await instance.loginPopup({ scopes: ["User.Read"] });
      if (response && response.accessToken) {
        // Send the obtained access token to the backend for authentication.
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
   * Email/Password Authentication Handlers
   ************************************************/

  /**
   * handleLogin
   *
   * Handles form submission for email/password login. Prevents default form submission,
   * calls the login function from context, and navigates accordingly.
   *
   * @param {React.FormEvent} e - Form event object.
   */
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

  /**
   * handleRegister
   *
   * Handles form submission for user registration with name, email, and password.
   * Prevents default form behavior, calls the registration function, and navigates based on the result.
   *
   * @param {React.FormEvent} e - Form event object.
   */
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

          {/*
            OAuth Buttons:
            Passing handlers for Google & Microsoft OAuth login to AuthButtons,
            which renders styled buttons with matching behavior.
          */}
          <AuthButtons
            handleGoogleSuccess={handleGoogleSuccess}
            handleGoogleError={handleGoogleError}
            handleMicrosoftLogin={handleMicrosoftLogin}
          />

          {/*
            Divider separating OAuth buttons and email/password login
          */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="subtitle2">or</Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          {/*
            Registration specific field for user's name (only shown in register mode)
          */}
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

          {/* Email input field */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />

          {/* Password input field */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />

          {/* Submit button */}
          <Button fullWidth type="submit" variant="contained" color="primary">
            {isLogin ? "Login" : "Register"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AuthPage;
