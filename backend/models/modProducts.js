const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    brand: {
      type: String,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      trim: true,
    },
    image: {
      type: [String],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Allcategories",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
