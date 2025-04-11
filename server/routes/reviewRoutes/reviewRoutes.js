import express from "express";
import { createReview, getProductReviews } from "../../controllers/review/reviewController.js";
import { protect } from "../../middlewares/Authmiddleware.js";

const router = express.Router();

router.post("/:productId", protect, createReview);           // Add review
router.get("/:productId", getProductReviews);                    // Get reviews for a product

export default router;
