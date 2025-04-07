import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @fileoverview Provides a UserContext which handles authentication logic
 * (login, register, Google auth, Microsoft auth) and stores the token/user data.
 *
 * @module UserContext
 */

const UserContext = createContext({
  isLoggedIn: false,
  authLoading: true,
  login: async () => {},
  registerUser: async () => {},
  loginWithGoogle: async () => {},
  loginWithMicrosoft: async () => {},
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, check if there's a token in local storage
    const token = localStorage.getItem("access_token");
    if (token) {
      // In a real app, you could verify this token with the server here.
      setIsLoggedIn(true);
    }
    setAuthLoading(false);
  }, []);

  /************************************************
   * Helper: handle server response
   ************************************************/
  const handleAuthResponse = async (response) => {
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("access_token", data.access);
      setIsLoggedIn(true);
      return { success: true, data };
    } else {
      return { success: false, message: data?.message || "Auth failed" };
    }
  };

  /************************************************
   * EMAIL/PASSWORD LOGIN
   ************************************************/
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/authorisation/login", {
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
   * EMAIL/PASSWORD REGISTER
   ************************************************/
  const registerUser = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:8080/authorisation/register", {
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
   * GOOGLE OAUTH
   ************************************************/
  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await fetch("http://localhost:8080/authorisation/google-auth", {
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
   * MICROSOFT OAUTH
   ************************************************/
  const loginWithMicrosoft = async (msToken) => {
    try {
      const response = await fetch("http://localhost:8080/authorisation/microsoft-auth", {
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
   * LOGOUT
   ************************************************/
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
