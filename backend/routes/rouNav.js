const express = require("express");
const {
  createnav,
  getnavitems,
  updatenav,
  deletenav,
} = require("../controllers/conNav");
const { vertoken } = require("../middleware/verifyToken");
const authRoles = require("../middleware/authRole");

const router = express.Router();

// create nav
router.post("/add", vertoken, authRoles("Admin"), createnav);

// get all nav
router.get("/", getnavitems);

// update nav
router.patch("/:id", vertoken, authRoles("Admin"), updatenav);

// delete nav
router.delete("/:id", vertoken, authRoles("Admin"), deletenav);

module.exports = router;