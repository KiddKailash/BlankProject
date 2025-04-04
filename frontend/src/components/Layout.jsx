/**
 * @file Dashboard.jsx
 * @description Layout component that renders the primary sidebar (if applicable) alongside
 * the main content area. The main content area displays the active route's content via Outlet.
 *
 * Layout:
 *    [Primary Sidebar] | [Main content area fills leftover space + can scroll]
 *
 * @module Layout
 */

import React from "react";
import { Outlet, useLocation } from "react-router-dom";

// Components
import Sidebar from "./Sidebar";

// MUI Components
import Box from "@mui/material/Box";

/**
 * Dashboard component that provides the main layout for the application.
 *
 * It conditionally renders the primary sidebar based on the current route. For example,
 * the sidebar is hidden on login, registration, home, or catch-all routes.
 *
 * @component
 * @returns {JSX.Element} The rendered Dashboard layout component.
 */
const Layout = () => {
  const location = useLocation();

  /**
   * Determines if the sidebar should be hidden based on the current path.
   *
   * The sidebar is not displayed on the following routes:
   * - /auth
   * - /
   * - *
   *
   * @type {boolean}
   */
  const doNotDisplaySidebar =
    location.pathname === "/auth" ||
    location.pathname === "/" ||
    location.pathname === "/404";

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh", // fill viewport height
        width: "100%", // fill viewport width
        bgcolor: "background.default",
        p: doNotDisplaySidebar ? 0 : 1,
      }}
    >
      {/* PRIMARY SIDEBAR */}
      {!doNotDisplaySidebar && (
        <Box
          sx={{
            flexShrink: 0,
            overflow: "auto",
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* Outer box that holds secondary sidebar + main content */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 5,
          display: "flex",
          flexGrow: 1, // let this box expand to fill leftover space
        }}
      >
        {/* Renders the route/page that is active */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
