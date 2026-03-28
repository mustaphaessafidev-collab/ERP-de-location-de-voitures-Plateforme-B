import axios from "axios";

// Configure base URL from environment variable or default to localhost:8000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth Service Object
export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        // If there are detailed Zod errors, format them into a single string
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
           throw new Error(error.response.data.errors.join('\n'));
        }
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      // If login is successful, store the token in localStorage
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
       if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw error;
    }
  },

  /**
   * Validate email with OTP
   */
  async validateEmail(otp) {
    try {
      const response = await apiClient.post("/auth/validate-email", { otp });
      // If validation is successful, store the token
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
       if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Validation failed");
      }
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem("auth_token");
  },

  /**
   * Get current user info from local storage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
