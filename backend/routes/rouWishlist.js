const express = require("express");
const router = express.Router();
const { authRoles } = require("../middleware/authRole");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
} = require("../controllers/conWishlist");
const { verifyAccessToken } = require("../middleware/verifyToken");

router.post("/add", verifyAccessToken, authRoles("User"), addToWishlist);
router.delete("/:productId", verifyAccessToken, authRoles("User"), removeFromWishlist);
router.get("/", verifyAccessToken, authRoles("User"), getWishlist);
router.delete("/clear", verifyAccessToken, authRoles("User"), clearWishlist);

module.exports = router;
