const express = require("express");
const router = express.Router();

const { authRoles } = require("../middleware/authRole");
const { vertoken } = require("../middleware/verifyToken");

const {
  createReview,
  getReviewsByProduct,
  getReviewsByUser,
  updateReview,
  deleteReview,
} = require("../controllers/conReview");

// Create review
router.post("/", vertoken, authRoles("User"), createReview);

// Get reviews by product
router.get("/product/:productId", getReviewsByProduct);

// Get logged-in user reviews
router.get("/user", vertoken, authRoles("User"), getReviewsByUser);

// Update review
router.put("/:id", vertoken, authRoles("User"), updateReview);

// Delete review
router.delete("/:id", vertoken, authRoles("User"), deleteReview);

module.exports = router;
