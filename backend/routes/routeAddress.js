const express = require("express");
const router = express.Router();

const { verifyAccessToken } = require("../middleware/verifyToken");
const { authRoles } = require("../middleware/authRole");

const {
  createAddress,
  getAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/conAddress");

router.post("/", verifyAccessToken, authRoles("User"), createAddress);

router.get("/", verifyAccessToken, authRoles("User"), getAddresses);

router.get("/:id", verifyAccessToken, authRoles("User"), getSingleAddress);

router.put("/:id", verifyAccessToken, authRoles("User"), updateAddress);

router.delete("/:id", verifyAccessToken, authRoles("User"), deleteAddress);

router.patch("/default/:id", verifyAccessToken, authRoles("User"), setDefaultAddress);

module.exports = router;
