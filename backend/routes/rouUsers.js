const express = require("express");
const router = express.Router();

const {
  create_user,
  login,
  logout,
  me,
  getCustomers,
  getVendors,
  updateAccount,
  deleteAccount,
  selfUpdateAccount,
} = require("../controllers/conUser");

const { vertoken } = require("../middleware/verifyToken");
const authRoles = require("../middleware/authRole");

// Public routes
router.post("/signup", create_user);
router.post("/login", login);

// Protected routes
router.post("/logout", vertoken, logout);

// Get current user info - single endpoint that works with any authenticated role
router.get("/me", vertoken, me);

// Optional: Role-specific endpoints for backwards compatibility
router.get("/me/user", vertoken, authRoles("User"), me);
router.get("/me/vendor", vertoken, authRoles("Vendor"), me);
router.get("/me/admin", vertoken, authRoles("Admin"), me);

router.get("/customers", getCustomers);
router.get("/vendors", getVendors);
router.patch("/:id", updateAccount);
router.delete("/:id", deleteAccount);

router.patch("/update", vertoken, selfUpdateAccount);

module.exports = router;
