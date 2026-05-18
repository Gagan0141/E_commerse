const express = require("express");
const router = express.Router();

const {
  // create_user,
  getCustomers,
  getVendors,
  updateAccount,
  deleteAccount,
  selfUpdateAccount,
} = require("../controllers/conUser");

const { verifyAccessToken } = require("../middleware/verifyToken");

const { authRoles } = require("../middleware/authRole");

// optional if you still want direct user creation
// router.post(
//   "/signup",
//   create_user
// );

// self update
router.patch("/update", verifyAccessToken, selfUpdateAccount);

// admin routes
router.get("/customers", verifyAccessToken, authRoles("Admin"), getCustomers);

router.get("/vendors", verifyAccessToken, authRoles("Admin"), getVendors);

router.patch("/:id", verifyAccessToken, authRoles("Admin"), updateAccount);

router.delete("/:id", verifyAccessToken, authRoles("Admin"), deleteAccount);

module.exports = router;
