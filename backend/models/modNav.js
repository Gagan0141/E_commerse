const mongoose = require("mongoose");

const navSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // imgurl: {
    //   type: String,
    //   default: "",
    // },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Allcategories",
        required: true,
      },
    ],

    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },

    // order: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("nav", navSchema);