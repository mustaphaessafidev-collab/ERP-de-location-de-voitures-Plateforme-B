import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const reviewService = {
  async getReviews(sort = "latest", category = "All Cars") {
    try {
      const response = await apiClient.get(`/reviews?sort=${sort}&category=${category}`);
      return response.data;
    } catch (error) {
      throw new Error("Impossible de charger les avis");
    }
  },

  async getStats() {
    try {
      const response = await apiClient.get("/reviews/stats");
      return response.data;
    } catch (error) {
      throw new Error("Impossible de charger les statistiques");
    }
  },

  async submitReview(reviewData) {
    try {
      const response = await apiClient.post("/reviews", reviewData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.map(e => e.message).join(", "));
      }
      throw new Error("Échec de l'envoi de l'avis");
    }
  },

  async updateReview(id, reviewData) {
    try {
      const response = await apiClient.patch(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error("Échec de la mise à jour de l'avis");
    }
  },

  async deleteReview(id) {
    try {
      const response = await apiClient.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Échec de la suppression de l'avis");
    }
  }
};
