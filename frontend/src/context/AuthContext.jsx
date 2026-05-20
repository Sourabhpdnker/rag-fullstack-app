import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Configure axios with explicit config
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = false; // Important!

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const { access_token, user } = response.data;
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setToken(access_token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        "/api/auth/register",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const { access_token, user } = response.data;
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setToken(access_token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
