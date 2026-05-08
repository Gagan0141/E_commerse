const modCart = require("../models/modCart");
const modProduct = require("../models/modProducts");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await modProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await modCart.findOne({ user: req.user.id });

    if (!cart) {
      // Create new cart
      cart = new modCart({
        user: req.user.id,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      // Check if product is already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId,
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          product: productId,
          quantity,
        });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await modCart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({
        message: "Item ID and quantity are required",
      });
    }

    const cart = await modCart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    let cart = await modCart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select:
        "title price image description brand discountPercentage category seller rating numReviews",
      populate: [
        {
          path: "category",
          select: "title slug",
        },
        {
          path: "seller",
        },
      ],
    });

    if (!cart) {
      return res.json({
        user: req.user.id,
        items: [],
        total: 0,
      });
    }

    const total = cart.items.reduce((sum, item) => {
      const productPrice = item.product.price || 0;
      return sum + productPrice * item.quantity;
    }, 0);

    res.json({
      ...cart._doc,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await modCart.findOneAndDelete({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const count = async (req, res) => {
  try {
    const cart = await modCart
      .findOne({ user: req.user.id })
      .select("items.quantity");

    const count =
      cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
  clearCart,
  count,
};
