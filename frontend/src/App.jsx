/**
 * @fileoverview Main application component that sets up routing and fetches data from the backend API.
 *
 * The App component defines the routing configuration using React Router's Routes and Route components.
 *
 * @module App
 */
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Webpages - Public
import PageNotFound from "./pages/public/PageNotFound";
import LandingPage from "./pages/public/LandingPage/LandingPage";
import AuthPage from "./pages/public/AuthPage/AuthPage";

// Webpages - Private
import Account from "./pages/private/Account";
import Activity from "./pages/private/Activity";
import AIAssistant from "./pages/private/AIAssistant";
import Analytics from "./pages/private/Analytics";
import Attendance from "./pages/private/Attendance";
import Calendar from "./pages/private/Calendar";
import Message from "./pages/private/Message";
import Storage from "./pages/private/Storage";
import Students from "./pages/private/Students";
import Dashboard from "./pages/private/Dashboard";
import Settings from "./pages/private/Settings";

// Components
import ProtectRoute from "./components/ProtectRoutes";
import Layout from "./components/Layout";

/**
 * App component that initializes application routing and performs data fetching.
 *
 * @component
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
  // Define an array of page objects, each with a route path and the component to render.
  // The "*" path acts as a catch-all route for undefined URLs.
  const pages = [
    { path: "/404", component: <PageNotFound /> },
    { path: "*", component: <Navigate to="/404" /> },
    { path: "/", component: <LandingPage /> },
    { path: "/auth", component: <AuthPage /> },
    { path: "/dashboard", component: <Dashboard /> },
    { path: "/account", component: <Account /> },
    { path: "/activity", component: <Activity /> },
    { path: "/ai-assistant", component: <AIAssistant /> },
    { path: "/analytics", component: <Analytics /> },
    { path: "/attendance", component: <Attendance /> },
    { path: "/calendar", component: <Calendar /> },
    { path: "/message", component: <Message /> },
    { path: "/storage", component: <Storage /> },
    { path: "/students", component: <Students /> },
    { path: "/settings", component: <Settings /> },
  ];

  // Define an array of paths that are public.
  // Any path not included in this list (and not the catch-all "*") will be considered protected.
  const publicPaths = ["/", "/auth"];

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {pages.map((page, i) => {
          // Determine if the route is public.
          const isPublic = publicPaths.includes(page.path) || page.path === "*";
          return (
            <Route
              key={i}
              path={page.path}
              element={
                isPublic ? (
                  page.component
                ) : (
                  <ProtectRoute>{page.component}</ProtectRoute>
                )
              }
            />
          );
        })}
      </Route>
    </Routes>
  );
}

export default App;
