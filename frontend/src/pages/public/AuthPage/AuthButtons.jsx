import React from "react";
import { GoogleLogin } from "@react-oauth/google";

// Material-UI components and styling utilities.
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// Icons for branding.
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Window"; // or any Microsoft icon

/**
 * OAuthButton
 *
 * A styled Button component that provides a shared style for OAuth buttons.
 * The style includes custom background, typography, border, and hover effects.
 */
const OAuthButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#3c4043",
  fontFamily: "Roboto, sans-serif",
  fontWeight: 500,
  fontSize: 14,
  textTransform: "none",
  boxShadow: "none",
  border: "1px solid #dadce0",
  borderRadius: 4,
  padding: "0 16px",
  height: 40,
  "&:hover": {
    backgroundColor: "#f6f9fe",
    boxShadow: "none",
    borderColor: "#c6c6c6",
  },
  // Hides the MUI ripple effect.
  "& .MuiTouchRipple-root": {
    display: "none",
  },
}));

/**
 * AuthButtons Component
 *
 * Renders OAuth buttons for Google and Microsoft authentication.
 * It leverages the GoogleLogin component for handling Google OAuth,
 * and a custom-styled button for Microsoft OAuth.
 *
 * @param {object} props - Component properties.
 * @param {Function} props.handleGoogleSuccess - Callback executed upon successful Google login.
 * @param {Function} props.handleGoogleError - Callback executed if Google login fails.
 * @param {Function} props.handleMicrosoftLogin - Function to handle Microsoft login when its button is clicked.
 * @param {object} props.msalInstance - Instance of the Microsoft Authentication Library (if applicable).
 *
 * @returns {JSX.Element} A component that renders a stack of authentication buttons.
 */
function AuthButtons({
  handleGoogleSuccess,
  handleGoogleError,
  handleMicrosoftLogin,
  msalInstance,
}) {
  return (
    <Stack spacing={1}>
      {/* Google OAuth Button */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        context="signin"
        auto_select={false}
        // Render custom-styled button using the OAuthButton component.
        render={({ onClick, disabled }) => (
          <OAuthButton
            onClick={onClick}
            disabled={disabled}
            startIcon={<GoogleIcon />} // Display Google icon.
            fullWidth
          >
            Continue with Google
          </OAuthButton>
        )}
      />

      {/* Microsoft OAuth Button */}
      <OAuthButton
        onClick={handleMicrosoftLogin}
        startIcon={<MicrosoftIcon />} // Display Microsoft icon.
        fullWidth
      >
        Continue with Microsoft
      </OAuthButton>
    </Stack>
  );
}

export default AuthButtons;
