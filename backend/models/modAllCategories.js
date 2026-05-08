const mongoose = require("mongoose");

const allcategoriesSchema = mongoose.Schema(
  {
    title: { type: String, unique: true, required: true, trim: true },
    slug: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Allcategories", allcategoriesSchema);
