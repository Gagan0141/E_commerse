const mongoose = require("mongoose");
const modAllCategories = require("../models/modAllCategories");
const modProducts = require("../models/modProducts");

const createproduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      brand,
      discountPercentage,
      image,
      category,
    } = req.body;
    if (!title || !price || !category) {
      return res.status(400).json({ message: "missing required fields" });
    }
    const catexist = await modAllCategories.findById(category);
    if (!catexist) {
      return res.status(400).json({ message: "category does not exists" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const seller = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(seller)) {
      return res.status(400).json({ message: "Invalid seller ID format" });
    }

    const data = await modProducts.create({
      title,
      description,
      price,
      stock,
      brand,
      discountPercentage,
      image,
      category,
      seller,
    });

    const populatedData = await modProducts
      .findById(data._id)
      .populate("category");

    res.json(populatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getallproducts = async (req, res) => {
  try {
    const data = await modProducts.find().populate("category");
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getproductbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await modProducts.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateproduct = async (req, res) => {
  const { id } = req.params;
  const updatedata = req.body;

  try {
    const product = await modProducts.findById(id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    if (
      req.user.id === product.seller.toString() ||
      req.user.role === "Admin"
    ) {
      const updateddata = await modProducts
        .findByIdAndUpdate(id, updatedata, {
          returnDocument: "after",
          runValidators: true,
        })
        .populate("category");

      return res.json(updateddata);
    }

    return res
      .status(403)
      .json({ message: "you are not the seller of this product" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    // const data = req.body;

    const product = await modProducts.findById(id);
    if (!product) return res.status(404).json({ message: "product not found" });
    if (
      req.user.id === product.seller.toString() ||
      req.user.role === "Admin"
    ) {
      const data = await modProducts.findByIdAndDelete(id);
      return res.json({ message: "deleted successfully", data });
    } else {
      return res
        .status(403)
        .json({ message: "you are not the seller of this product" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getproductsbycategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await modProducts.find({ category }).populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getproductsbyseller = async (req, res) => {
  try {
    const { seller } = req.params;
    const products = await modProducts.find({ seller }).populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getreviewsbyproductid = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if product exists
    const product = await modProducts.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Assuming your Product model has a reviews array field
    // If reviews are stored in a separate collection, you'll need to adjust this
    const productWithReviews = await modProducts.findById(id).populate({
      path: "reviews",
      populate: {
        path: "user", // assuming reviews have a user reference
        select: "name email", // adjust fields as needed
      },
    });

    res.json(productWithReviews.reviews || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addreview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Validate required fields
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    // Check if product exists
    const product = await modProducts.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate user (if you want to ensure it's the authenticated user)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Create review object
    const review = {
      user: req.user.id,
      rating,
      comment,
      createdAt: new Date(),
    };

    // Add review to product (assuming reviews is an array in your Product model)
    product.reviews = product.reviews || [];
    product.reviews.push(review);

    // Calculate average rating
    const totalRating = product.reviews.reduce(
      (sum, rev) => sum + rev.rating,
      0,
    );
    product.averageRating = totalRating / product.reviews.length;

    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createproduct,
  getallproducts,
  getproductbyid,
  updateproduct,
  deleteproduct,
  getproductsbycategory,
  getproductsbyseller,
  getreviewsbyproductid,
  addreview,
};
