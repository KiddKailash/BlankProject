import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @fileoverview Provides a UserContext which handles authentication logic
 * and user state management.
 */

// Default context state values
const UserContext = createContext({
  isLoggedIn: false,
  authLoading: true,
  user: null,
  login: async () => {},
  registerUser: async () => {},
  loginWithGoogle: async () => {},
  loginWithMicrosoft: async () => {},
  logout: () => {},
  updateUserProfile: async () => {},
});

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_SERVER_URI || "http://localhost:8080";

  /**
   * Verifies the JWT and retrieves a minimal user profile using the `/authorisation/verify` endpoint.
   * This replaces the previous call to `/user/profile` which is not available.
   */
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${backendUrl}/authorisation/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Here we create a simple user object containing the userId.
        setUser({ userId: data.userId });
        return true;
      }
      setUser(null);
      return false;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      return false;
    }
  };

  /**
   * Updates the user's profile data.
   * Note: This function still calls `/user/profile`—if you have an endpoint for profile updates,
   * make sure it exists; otherwise, you might need to adjust this as well.
   */
  const updateUserProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${backendUrl}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        // Update the user state with any new profile information
        setUser(updatedData);
        return { success: true, data: updatedData };
      }
      const errorRes = await response.json();
      return { success: false, message: errorRes.message };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, message: "Failed to update profile" };
    }
  };

  /**
   * Verify token and fetch user data on initial load.
   */
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/authorisation/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLoggedIn(true);
          // Use the same verification endpoint to get a minimal profile
          await fetchUserProfile(token);
        } else {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyToken();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Processes the authentication response from the server.
   * Expects a response with an "access" property (the JWT token).
   * It stores the token, updates the logged in state, fetches the user profile,
   * and navigates to the dashboard.
   */
  const handleAuthResponse = async (response) => {
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("access_token", data.access);
      setIsLoggedIn(true);
      await fetchUserProfile(data.access);
      navigate("/dashboard");
      return { success: true, data };
    }
    return {
      success: false,
      message: data?.message || "Authentication failed",
    };
  };

  /**
   * Email/Password Login.
   */
  const login = async (email, password) => {
    try {
      const response = await fetch(`${backendUrl}/authorisation/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await handleAuthResponse(response);
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server error" };
    }
  };

  /**
   * User Registration.
   */
  const registerUser = async (name, email, password) => {
    try {
      const response = await fetch(`${backendUrl}/authorisation/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      return await handleAuthResponse(response);
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Server error" };
    }
  };

  /**
   * Google OAuth Login.
   */
  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await fetch(`${backendUrl}/authorisation/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
        credentials: "include", // For cookie handling if required.
      });
      return await handleAuthResponse(response);
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, message: "Server error" };
    }
  };

  /**
   * Microsoft OAuth Login.
   */
  const loginWithMicrosoft = async (msToken) => {
    try {
      const response = await fetch(
        `${backendUrl}/authorisation/microsoft-auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: msToken }),
          credentials: "include",
        }
      );
      return await handleAuthResponse(response);
    } catch (error) {
      console.error("Microsoft login error:", error);
      return { success: false, message: "Server error" };
    }
  };

  /**
   * Logout.
   */
  const logout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/auth?mode=login");
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        authLoading,
        user,
        login,
        registerUser,
        loginWithGoogle,
        loginWithMicrosoft,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
