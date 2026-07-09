const Order = require("../models/modOrder");
const Cart = require("../models/modCart");
const Product = require("../models/modProducts");

//user
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.discountPercentage
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price,
    }));

    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .populate("user");

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "approved",
      "rejected",
      "shipped",
      "delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Reduce stock only once when approving
    if (status === "approved" && order.status !== "approved") {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);

        if (!product) {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `${product.title} is out of stock`,
          });
        }

        product.stock -= item.quantity;
        await product.save();
      }
    }

    order.status = status;
    await order.save();

    res.json({
      message: `Order ${status} successfully`,
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getMyOrders,
};
