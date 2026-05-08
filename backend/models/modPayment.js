import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "UPI", "CARD"]
  },
  transactionId: String,
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);