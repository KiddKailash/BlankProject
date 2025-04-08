import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

// Contexts
import UserContext from "../services/UserContext";

// MUI Components
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProtectRoute = ({ children }) => {
  const { isLoggedIn, authLoading, user } = useContext(UserContext);
  console.log('User is', user);

  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not logged in or user data is missing, redirect to the login page
  if (!isLoggedIn || !user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return children;
};

ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectRoute;
