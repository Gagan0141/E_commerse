const express = require("express");
const router = express.Router();
const authRoles = require("../middleware/authRole");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
} = require("../controllers/conWishlist");
const { vertoken } = require("../middleware/verifyToken");

router.post("/add", vertoken, authRoles("User"), addToWishlist);
router.delete("/:productId", vertoken, authRoles("User"), removeFromWishlist);
router.get("/", vertoken, authRoles("User"), getWishlist);
router.delete("/clear", vertoken, authRoles("User"), clearWishlist);

module.exports = router;
