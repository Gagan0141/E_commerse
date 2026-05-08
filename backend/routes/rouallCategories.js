const express = require("express");
const {
  create_category,
  getallcategories,
  soft_delete,
  updatecat,
} = require("../controllers/conAllCategories");
const authRoles = require("../middleware/authRole");
const { vertoken } = require("../middleware/verifyToken");
const router = express.Router();

//admin only
router.post("/add", vertoken, authRoles("Admin"), create_category);
router.delete("/:id", vertoken, authRoles("Admin"), soft_delete);

router.patch("/:id", vertoken, authRoles("Admin"), updatecat);
//public
router.get("/", getallcategories);

module.exports = router;
