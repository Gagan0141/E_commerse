const express = require("express");
const {
  create_category,
  getallcategories,
  soft_delete,
  updatecat,
} = require("../controllers/conAllCategories");
const { authRoles } = require("../middleware/authRole");
const { verifyAccessToken } = require("../middleware/verifyToken");
const router = express.Router();

//admin only
router.post("/add", verifyAccessToken, authRoles("Admin"), create_category);
router.delete("/:id", verifyAccessToken, authRoles("Admin"), soft_delete);

router.patch("/:id", verifyAccessToken, authRoles("Admin"), updatecat);
//public
router.get("/", getallcategories);

module.exports = router;
