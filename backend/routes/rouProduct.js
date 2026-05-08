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
  getProducts,
} = require("../controllers/conProduct");

router.post("/add", vertoken, authRoles("Vendor", "Admin"), createproduct);

// search first
router.get("/filter", getProducts);

router.get("/", getallproducts);

router.get("/category/:category", getproductsbycategory);
router.get("/seller/:seller", getproductsbyseller);

router.get("/:id/reviews", getreviewsbyproductid);
router.post("/:id/reviews", vertoken, addreview);

// product by id last
router.get("/:id", getproductbyid);

router.patch("/:id", vertoken, authRoles("Vendor", "Admin"), updateproduct);
router.delete("/:id", vertoken, authRoles("Vendor", "Admin"), deleteproduct);


module.exports = router;
