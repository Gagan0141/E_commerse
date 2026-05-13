const modWishlist = require("../models/modWishlist");
const modProduct = require("../models/modProducts");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await modProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await modWishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      // Create new wishlist
      wishlist = new modWishlist({
        user: req.user.id,
        products: [productId],
      });
    } else {
      // Check if product is already in wishlist
      if (wishlist.products.some((p) => p.toString() === productId)) {
        return res.json({ message: "Product already in wishlist" });
      }

      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const wishlist = await modWishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId.toString(),
    );

    await wishlist.save();

    const updatedWishlist = await modWishlist
      .findById(wishlist._id)
      .populate("products");

    res.status(200).json({
      message: "Removed from wishlist",
      products: updatedWishlist.products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    let wishlist = await modWishlist
      .findOne({ user: req.user.id })
      .populate("products");
    if (!wishlist) {
      wishlist = { user: req.user.id, products: [] };
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await modWishlist.findOneAndDelete({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
};
