const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "orderitem"
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    fullName: String,
    phone: String,
    type: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  paymentId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);