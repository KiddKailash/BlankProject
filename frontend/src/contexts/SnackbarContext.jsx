import React, { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

// Material-UI components for Snackbar and Alert notifications.
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

/**
 * SnackbarContext
 *
 * Context to provide a function to display notifications via a Snackbar.
 * Using React's Context API allows consuming components to trigger snackbars without
 * directly managing their state.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const SnackbarContext = createContext();

/**
 * SnackbarProvider Component
 *
 * This provider component maintains the state and logic for displaying snackbars.
 * It exposes a `showSnackbar` method to the context consumers which allows them
 * to trigger notifications. Additionally, it renders a Material-UI Snackbar and Alert,
 * which automatically hide after a set duration.
 *
 * @param {object} props - Component properties.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the provider.
 * @returns {JSX.Element} The provider component wrapping its children and the Snackbar UI.
 */
export const SnackbarProvider = ({ children }) => {
  // Local state for the snackbar, including its open status, message content, and severity level.
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // Options: 'error', 'warning', 'info', 'success'
  });

  /**
   * showSnackbar
   *
   * Function to trigger the display of the Snackbar with a specified message and severity.
   * It is memoized with useCallback to avoid unnecessary re-renders.
   *
   * @param {string} message - The message to be shown in the Snackbar.
   * @param {string} [severity="info"] - The severity level of the message; controls the Alert style.
   */
  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  /**
   * handleClose
   *
   * Handler to close the snackbar. It prevents closing on clickaway events.
   *
   * @param {object} event - The event source of the callback.
   * @param {string} reason - The reason for closing, e.g., "clickaway".
   */
  const handleClose = (event, reason) => {
    // Prevent closing the Snackbar if the user clicks away from it.
    if (reason === "clickaway") {
      return;
    }
    // Update the state to close the Snackbar.
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {/* Render the Snackbar UI for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500} // Auto hide after 4500 ms
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position on screen
      >
        {/* Alert component provides a styled notification based on severity */}
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// PropTypes validation to ensure children are provided and are valid React nodes.
SnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
