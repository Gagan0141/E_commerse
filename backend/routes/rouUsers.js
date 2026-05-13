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

const { vertoken } = require("../middleware/verifyToken");

const { authRoles } = require("../middleware/authRole");

// optional if you still want direct user creation
// router.post(
//   "/signup",
//   create_user
// );

// self update
router.patch("/update", vertoken, selfUpdateAccount);

// admin routes
router.get("/customers", vertoken, authRoles("Admin"), getCustomers);

router.get("/vendors", vertoken, authRoles("Admin"), getVendors);

router.patch("/:id", vertoken, authRoles("Admin"), updateAccount);

router.delete("/:id", vertoken, authRoles("Admin"), deleteAccount);

module.exports = router;
