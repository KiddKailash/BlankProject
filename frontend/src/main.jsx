/**
 * @fileoverview Entry point for the application. This file sets up the React application with
 * React Router and Material-UI. It defines a Root component that maintains the current theme mode
 * (light or dark), memoizes the Material-UI theme using a custom getTheme function, and provides a
 * ThemeSwitcher component to allow users to toggle between light and dark modes.
 *
 * The application is wrapped with Material-UI's ThemeProvider and CssBaseline to ensure global styling
 * is applied consistently. The Router component wraps the App component to provide routing capabilities.
 * Finally, ReactDOM creates the root element and renders the application.
 *
 * @module index
 */

import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { UserProvider } from "./services/UserContext";

// OAuth Providers
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// MUI Theme Provider, CSS Baseline and a component which switches the theme
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./styles/global";

// 1) MSAL config – load from your Vite env variables
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_MICROSOFT_TENANT_ID
    }`,
    redirectUri: window.location.origin,
  },
};

const pca = new PublicClientApplication(msalConfig);

/**
 * Root component that sets up the global theme and routing for the application.
 *
 * @component
 * @returns {JSX.Element} The Root component wrapped with ThemeProvider and Router.
 */
export const Root = () => {
  // Set colour scheme mode to light/dark
  const mode = "light";

  // Memoize theme to avoid unnecessary recalculations on re-renders
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <Router>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <MsalProvider instance={pca}>
          <UserProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider>
                <App />
              </SnackbarProvider>
            </ThemeProvider>
          </UserProvider>
        </MsalProvider>
      </GoogleOAuthProvider>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
