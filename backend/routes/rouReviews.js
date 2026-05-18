const express = require("express");
const router = express.Router();

const { authRoles } = require("../middleware/authRole");
const { verifyAccessToken } = require("../middleware/verifyToken");

const {
  createReview,
  getReviewsByProduct,
  getReviewsByUser,
  updateReview,
  deleteReview,
} = require("../controllers/conReview");

// Create review
router.post("/", verifyAccessToken, authRoles("User"), createReview);

// Get reviews by product
router.get("/product/:productId", getReviewsByProduct);

// Get logged-in user reviews
router.get("/user", verifyAccessToken, authRoles("User"), getReviewsByUser);

// Update review
router.put("/:id", verifyAccessToken, authRoles("User"), updateReview);

// Delete review
router.delete("/:id", verifyAccessToken, authRoles("User"), deleteReview);

module.exports = router;
