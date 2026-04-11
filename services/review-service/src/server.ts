import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma, checkDatabaseConnection } from "./config/prisma";
import { z } from "zod";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// --- VALIDATORS ---
// Using z.coerce to automatically convert strings to numbers
const reviewSchema = z.object({
  userId: z.coerce.number(),
  userName: z.string().min(1),
  userAvatar: z.string().optional(),
  carName: z.string().min(1),
  carCategory: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(1, "Le titre est requis"),
  comment: z.string().min(1, "Le commentaire est requis"),
});

const updateReviewSchema = reviewSchema.partial();

// --- ROUTES ---

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "review-service" });
});

// Get all reviews with advanced sorting
app.get("/api/reviews", async (req, res) => {
  try {
    const { sort = "latest", category = "All Cars" } = req.query;
    
    let orderBy: any = { createdAt: "desc" };
    if (sort === "highest") orderBy = { rating: "desc" };
    if (sort === "lowest") orderBy = { rating: "asc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };

    const where: any = {};
    if (category !== "All Cars") {
      where.carCategory = category as string;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy,
    });
    res.json(reviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Get stats
app.get("/api/reviews/stats", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    const total = reviews.length;
    if (total === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = parseFloat((sum / total).toFixed(1));

    const distribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    res.json({ averageRating, totalReviews: total, distribution });
  } catch (error) {
    console.error("Fetch stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Create
app.post("/api/reviews", async (req, res) => {
  try {
    console.log("Incoming review data:", req.body);
    const data = reviewSchema.parse(req.body);
    const review = await prisma.review.create({
      data: { ...data, isVerified: true }
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error details:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Failed to create review", details: error instanceof Error ? error.message : String(error)});
  }
});

// Update
app.patch("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateReviewSchema.parse(req.body);
    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(review);
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// Delete
app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

const start = async () => {
  await checkDatabaseConnection();
  app.listen(PORT, () => console.log(`Review service running on port ${PORT}`));
};

start();
