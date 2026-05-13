const express = require("express");
const router = express.Router();

const { vertoken } = require("../middleware/verifyToken");
const { authRoles } = require("../middleware/authRole");

const {
  createAddress,
  getAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/conAddress");

router.post("/", vertoken, authRoles("User"), createAddress);

router.get("/", vertoken, authRoles("User"), getAddresses);

router.get("/:id", vertoken, authRoles("User"), getSingleAddress);

router.put("/:id", vertoken, authRoles("User"), updateAddress);

router.delete("/:id", vertoken, authRoles("User"), deleteAddress);

router.patch("/default/:id", vertoken, authRoles("User"), setDefaultAddress);

module.exports = router;
