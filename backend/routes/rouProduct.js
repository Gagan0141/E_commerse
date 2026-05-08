const express = require("express");
const router = express.Router();

const Product = require("../models/modProducts");
const Category = require("../models/modCategory");
const { vertoken } = require("../middleware/verifyToken");
const authRoles = require("../middleware/authRole");
const {
  createproduct,
  getallproducts,
  getproductbyid,
  updateproduct,
  deleteproduct,
  getproductsbycategory,
  getproductsbyseller,
  getreviewsbyproductid,
  addreview,
} = require("../controllers/conProduct");

router.post("/add", vertoken, authRoles("Vendor","Admin"), createproduct);

router.get("/", getallproducts);

router.patch("/:id", vertoken, authRoles("Vendor","Admin"), updateproduct);
router.delete("/:id", vertoken, authRoles("Vendor","Admin"), deleteproduct);

router.get("/:id", getproductbyid);//for product page

router.get("/category/:category", getproductsbycategory);
router.get("/seller/:seller", getproductsbyseller);

router.get("/:id/reviews", getreviewsbyproductid);
router.post("/:id/reviews", vertoken, addreview);

module.exports = router;
