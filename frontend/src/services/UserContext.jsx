import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @fileoverview Provides a UserContext which handles authentication logic
 * (login, register, Google auth, Microsoft auth) and stores the token/user data.
 *
 * This context verifies existing tokens on load, provides functions to log in
 * or register via email/password or OAuth (Google/Microsoft), and allows logging out.
 *
 * @module UserContext
 */

// Default context state values with stub async functions.
const UserContext = createContext({
  isLoggedIn: false,
  authLoading: true,
  login: async () => {},
  registerUser: async () => {},
  loginWithGoogle: async () => {},
  loginWithMicrosoft: async () => {},
  logout: () => {},
});

/**
 * UserProvider Component
 *
 * Provides the UserContext to its children and encapsulates all authentication logic.
 *
 * @param {object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components that require access to user state.
 * @returns {JSX.Element} The context provider wrapper.
 */
export const UserProvider = ({ children }) => {
  // State to track if the user is logged in.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to track if authentication verification is in progress.
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Retrieve the backend URL from environment or fallback to localhost.
  const backendUrl = import.meta.env.VITE_SERVER_URI || "http://localhost:8080";

  /**
   * Verify the stored token on initial load.
   * If a token exists in localStorage, make a GET call to verify its validity.
   * If valid, user is logged in; otherwise, remove the token.
   */
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        // No token found means user is not logged in.
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}authorisation/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Valid token, update login state.
          setIsLoggedIn(true);
        } else {
          // Invalid or expired token; clear from storage.
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        // On error, assume token is invalid.
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyToken();
    // Do not add backendUrl to dependency array to avoid unintended loops.
    // eslint-disable-next-line
  }, []);

  /************************************************
   * Helper: Handle Server Authentication Response
   ************************************************/
  /**
   * Process the server's authentication response.
   *
   * @param {Response} response - The fetch response from the server.
   * @returns {Promise<Object>} An object containing success flag and returned data or error message.
   */
  const handleAuthResponse = async (response) => {
    const data = await response.json();
    if (response.ok) {
      // Store the access token and update login state.
      localStorage.setItem("access_token", data.access);
      setIsLoggedIn(true);
      return { success: true, data };
    } else {
      return { success: false, message: data?.message || "Auth failed" };
    }
  };

  /************************************************
   * EMAIL/PASSWORD LOGIN Handler
   ************************************************/
  /**
   * Log in the user using email and password.
   *
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} The result of the authentication attempt.
   */
  const login = async (email, password) => {
    try {
      const response = await fetch(`${backendUrl}authorisation/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return handleAuthResponse(response);
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server error" };
    }
  };

  /************************************************
   * EMAIL/PASSWORD REGISTER Handler
   ************************************************/
  /**
   * Register a new user with name, email, and password.
   *
   * @param {string} name - User's full name.
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} The result of the registration attempt.
   */
  const registerUser = async (name, email, password) => {
    try {
      const response = await fetch(`${backendUrl}authorisation/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      return handleAuthResponse(response);
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Server error" };
    }
  };

  /************************************************
   * GOOGLE OAUTH LOGIN Handler
   ************************************************/
  /**
   * Log in using Google OAuth token.
   *
   * @param {string} googleToken - The JWT token obtained from Google.
   * @returns {Promise<Object>} The result of the Google authentication attempt.
   */
  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await fetch(`${backendUrl}authorisation/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });
      return handleAuthResponse(response);
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, message: "Server error" };
    }
  };

  /************************************************
   * MICROSOFT OAUTH LOGIN Handler
   ************************************************/
  /**
   * Log in using Microsoft OAuth token.
   *
   * @param {string} msToken - The token obtained from Microsoft authentication.
   * @returns {Promise<Object>} The result of the Microsoft authentication attempt.
   */
  const loginWithMicrosoft = async (msToken) => {
    try {
      const response = await fetch(`${backendUrl}authorisation/microsoft-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: msToken }),
      });
      return handleAuthResponse(response);
    } catch (error) {
      console.error("Microsoft login error:", error);
      return { success: false, message: "Server error" };
    }
  };

  /************************************************
   * LOGOUT Handler
   ************************************************/
  /**
   * Logs the user out by removing the stored access token, updating the login state,
   * and redirecting to the login page.
   */
  const logout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/auth?mode=login");
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        authLoading,
        login,
        registerUser,
        loginWithGoogle,
        loginWithMicrosoft,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
