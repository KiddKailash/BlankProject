/**
 * @file Sidebar.jsx
 * @description A responsive and collapsible sidebar component built with Material UI.
 * It displays navigation items with icons and tooltips. When collapsed, it shows only icons;
 * when expanded, it shows both icons and text. The sidebar includes a toggle button to expand/collapse,
 * and navigation items that use react-router's navigation. It also includes a settings section with
 * additional options (e.g., Account, Settings, Logout).
 *
 * @module Sidebar
 */

import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Local Imports
import UserContext from "../services/UserContext";

// MUI Components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

// MUI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimelineIcon from "@mui/icons-material/Timeline";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BarChartIcon from "@mui/icons-material/BarChart";
import MessageIcon from "@mui/icons-material/Message";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

// Navigation items for main section of the sidebar
const navItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Storage", icon: <StorageIcon /> },
  { text: "Calendar", icon: <CalendarTodayIcon /> },
  { text: "Activity", icon: <TimelineIcon /> },
  { text: "Students", icon: <PeopleIcon /> },
  { text: "Attendance", icon: <EventAvailableIcon /> },
  { text: "Analytics", icon: <BarChartIcon /> },
  { text: "Message", icon: <MessageIcon /> },
  { text: "AI Assistant", icon: <SmartToyIcon /> },
];

// Navigation items for settings section of the sidebar
const settingsItems = [
  { text: "Account", icon: <AccountCircleIcon /> },
  { text: "Settings", icon: <SettingsIcon /> },
  { text: "Logout", icon: <LogoutIcon />, isLogout: true },
];

/**
 * Sidebar component that renders a collapsible navigation sidebar.
 *
 * The sidebar features:
 * - A toggle button to expand or collapse the sidebar.
 * - Navigation items with icons (and text when expanded).
 * - Tooltips that display item text when the sidebar is collapsed.
 * - A settings section with additional options.
 *
 * @component
 * @returns {JSX.Element} The rendered Sidebar component.
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Track whether the sidebar is collapsed
  const [collapsed, setCollapsed] = React.useState(false);

  // Import UserContext to manage user authentication state
  const { logout } = useContext(UserContext);

  /**
   * Determines if a given navigation path is active.
   *
   * @param {string} path - The navigation path text.
   * @returns {boolean} True if the current location matches the given path.
   */
  const isActive = (path) =>
    location.pathname === `/${path.toLowerCase().replace(" ", "-")}`;

  // Compute dynamic sidebar width based on collapsed state.
  const SIDEBAR_WIDTH = collapsed ? 72 : 200;

  const handleLogout = async () => {
    await logout();
    navigate("/auth?mode=login");
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 5,
        p: 1,
      }}
    >
      {/* Top section with toggle button and logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
          pl: collapsed ? 0 : 1.5,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          size="small"
          color="primary"
          sx={{ mr: collapsed ? 0 : 1, borderRadius: 2 }}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>

        {/* Display logo text only when expanded */}
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold" color="primary">
            Vellum
          </Typography>
        )}
      </Box>

      {/* Navigation list */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map(({ text, icon }) => {
          const path = `/${text.toLowerCase().replace(" ", "-")}`;
          const selected = isActive(text);
          return (
            <Tooltip
              key={text}
              title={collapsed ? text : ""}
              placement="right"
              arrow
              disableHoverListener={!collapsed} // Only show tooltip if collapsed
            >
              <ListItemButton
                onClick={() => navigate(path)}
                selected={selected}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "primary.main",
                    minWidth: collapsed ? "auto" : "40px",
                  }}
                >
                  {icon}
                </ListItemIcon>

                {/* Show text only when sidebar is expanded */}
                {!collapsed && <ListItemText primary={text} />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mb: 1 }} />

      {/* Settings section */}
      <Box>
        {/* Show "SETTINGS" label only if sidebar is expanded */}
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{ color: "gray", fontWeight: "bold", px: 2 }}
          >
            SETTINGS
          </Typography>
        )}
        <List>
          {settingsItems.map(({ text, icon, isLogout }) => (
            <Tooltip
              key={text}
              title={collapsed ? text : ""}
              placement="right"
              arrow
              disableHoverListener={!collapsed}
            >
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  color: isLogout ? "error.main" : "inherit",
                  justifyContent: collapsed ? "center" : "flex-start",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isLogout ? "error.main" : "inherit",
                    minWidth: collapsed ? "auto" : "40px",
                  }}
                >
                  {icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={text} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
