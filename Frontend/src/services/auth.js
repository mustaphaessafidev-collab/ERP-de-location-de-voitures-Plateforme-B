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

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
        throw new Error(error.response.data.message || "Echec de l'inscription");
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
        throw new Error(error.response.data.message || "Echec de la connexion");
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
        throw new Error(error.response.data.message || "Echec de la validation");
      }
      throw error;
    }
  },

  /**
   * Get user profile from API
   */
  async getProfile() {
    try {
      const response = await apiClient.get("/profile/profile");
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // Fallback to localStorage if API fails
      return this.getCurrentUser();
    }
  },

  async updatePersonalInfo(personalData) {
    try {
      const response = await apiClient.put("/profile/personal-info", personalData);
      if (response.data?.profile) {
        localStorage.setItem("user", JSON.stringify(response.data.profile));
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const details = Array.isArray(error.response.data.errors)
          ? error.response.data.errors.join("\n")
          : error.response.data.message;
        throw new Error(details || "Echec de la mise a jour des informations personnelles");
      }
      throw error;
    }
  },

  async updateProfilePhoto(photoData) {
    try {
      const response = await apiClient.put("/profile/photo", photoData);
      if (response.data?.profile) {
        localStorage.setItem("user", JSON.stringify(response.data.profile));
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const details = Array.isArray(error.response.data.errors)
          ? error.response.data.errors.join("\n")
          : error.response.data.message;
        throw new Error(details || "Echec de la mise a jour de la photo de profil");
      }
      throw error;
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword, confirmPassword) {
    try {
      const response = await apiClient.put("/profile/password", {
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const details = Array.isArray(error.response.data.errors)
          ? error.response.data.errors.join("\n")
          : error.response.data.message;
        throw new Error(details || "Echec de la mise a jour du mot de passe");
      }
      throw error;
    }
  },

  async updateDrivingLicense(licenseData) {
    try {
      const response = await apiClient.put("/profile/license", licenseData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const details = Array.isArray(error.response.data.errors)
          ? error.response.data.errors.join("\n")
          : error.response.data.message;
        throw new Error(details || "Echec de la mise a jour du permis de conduire");
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
