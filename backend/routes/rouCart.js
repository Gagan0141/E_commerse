const express = require("express");
const router = express.Router();
const { authRoles } = require("../middleware/authRole");
const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
  clearCart,
  count,
} = require("../controllers/conCart");
const { vertoken } = require("../middleware/verifyToken");

router.post("/add", vertoken, authRoles("User"), addToCart);
router.delete("/:itemId", vertoken, authRoles("User"), removeFromCart);
router.put(
  "/quantity/:itemId",
  vertoken,
  authRoles("User"),
  updateCartItemQuantity,
);
router.get("/", vertoken, authRoles("User"), getCart);
router.delete("/clear", vertoken, authRoles("User"), clearCart);

router.get("/count", vertoken, count);

module.exports = router;
