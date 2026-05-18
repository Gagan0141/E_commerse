const express = require("express");
const {
  createnav,
  getnavitems,
  updatenav,
  deletenav,
} = require("../controllers/conNav");
const { verifyAccessToken } = require("../middleware/verifyToken");
const { authRoles } = require("../middleware/authRole");

const router = express.Router();

// create nav
router.post("/add", verifyAccessToken, authRoles("Admin"), createnav);

// get all nav
router.get("/", getnavitems);

// update nav
router.patch("/:id", verifyAccessToken, authRoles("Admin"), updatenav);

// delete nav
router.delete("/:id", verifyAccessToken, authRoles("Admin"), deletenav);

module.exports = router;
