const modOrder = require("../models/modOrder");
const modOrderItem = require("../models/modOrderitem");
const modCart = require("../models/modCart");
const modProduct = require("../models/modProducts");

// Create Order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    if (!totalAmount) {
      return res.status(400).json({
        message: "Total amount is required",
      });
    }

    // Create order items
    const orderItems = [];
    for (const item of items) {
      const product = await modProduct.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          message: `Product ${item.product} not found`,
        });
      }

      const orderItem = await modOrderItem.create({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });

      orderItems.push(orderItem._id);
    }

    // Create order
    const order = await modOrder.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
    });

    // Clear user's cart
    await modCart.deleteMany({ userid: userId });

    res.status(201).json({
      orderId: order._id,
      amount: totalAmount,
      message: "Order created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await modOrder
      .find({ user: userId })
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "product",
        },
      })
      .sort({ createdAt: -1 });

    res.json(orders || []);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Order Details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await modOrder
      .findById(orderId)
      .populate({
        path: "items",
        populate: {
          path: "product",
          model: "product",
        },
      });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Verify user owns this order
    if (order.user.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status (Admin/Vendor)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await modOrder.findByIdAndUpdate(
      orderId,
      { status },
      { returnDocument: 'after' }
    ).populate({
      path: "items",
      populate: {
        path: "product",
        model: "product",
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Payment Status
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, razorpayPaymentId, razorpayOrderId } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        message: "Payment status is required",
      });
    }

    const updateData = {
      paymentStatus,
    };

    if (razorpayPaymentId) {
      updateData.razorpayPaymentId = razorpayPaymentId;
    }

    if (razorpayOrderId) {
      updateData.razorpayOrderId = razorpayOrderId;
    }

    const order = await modOrder.findByIdAndUpdate(
      orderId,
      updateData,
      { returnDocument: 'after' }
    ).populate({
      path: "items",
      populate: {
        path: "product",
        model: "product",
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await modOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (order.status !== "pending" && order.status !== "confirmed") {
      return res.status(400).json({
        message: "Cannot cancel order with current status",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify Payment and Update Order
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        message: "Missing payment verification data",
      });
    }

    // Update order with payment info
    const order = await modOrder.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        razorpayPaymentId,
        status: "confirmed",
      },
      { returnDocument: 'after' }
    ).populate({
      path: "items",
      populate: {
        path: "product",
        model: "product",
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Payment verified and order confirmed",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  verifyPayment,
};
