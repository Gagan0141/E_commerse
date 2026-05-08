const express = require("express");
const navModel = require("../models/modNav");
const {
  createnav,
  getnavitems,
  updatenav,
  deletenav,
} = require("../controllers/conNav");
const { vertoken } = require("../middleware/verifyToken");
const authRoles = require("../middleware/authRole");

const router = express.Router();

// Create new nav items
router.post("/add", vertoken, authRoles("Admin"), createnav);

// Get all nav items
router.get("/", getnavitems);

// update nav items
router.patch("/:id", vertoken, authRoles("Admin"), updatenav);

// delete nav items
router.delete("/:id", vertoken, authRoles("Admin"), deletenav);

module.exports = router;
