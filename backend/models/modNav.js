const mongoose = require("mongoose");

const navSchema = mongoose.Schema(
  {
    title: { type: String },
    imgurl: { type: String },
    path: { type: String },
  },
  { timestamp: true },
);

module.exports = mongoose.model("nav", navSchema);
