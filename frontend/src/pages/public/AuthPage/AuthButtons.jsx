import React from "react";
import { GoogleLogin } from "@react-oauth/google";

// MUI imports
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// Icons
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Window"; // or any MS icon

// 1) Create a shared style for both Google & Microsoft
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
  // Hides the MUI ripple
  "& .MuiTouchRipple-root": {
    display: "none",
  },
}));

function AuthButtons({
  handleGoogleSuccess,
  handleGoogleError,
  handleMicrosoftLogin,
  msalInstance,
}) {
  return (
    <Stack spacing={1}>
      {/* GOOGLE OAUTH */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        context="signin"
        auto_select={false}
        render={({ onClick, disabled }) => (
          <OAuthButton
            onClick={onClick}
            disabled={disabled}
            startIcon={<GoogleIcon />}
            fullWidth
          >
            Continue with Google
          </OAuthButton>
        )}
      />

      {/* MICROSOFT OAUTH */}
      <OAuthButton
        onClick={handleMicrosoftLogin}
        startIcon={<MicrosoftIcon />}
        fullWidth
      >
        Continue with Microsoft
      </OAuthButton>
    </Stack>
  );
}

export default AuthButtons;
