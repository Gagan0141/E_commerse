const { default: mongoose } = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    isDefault: { type: Boolean, default: false },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true },
);
module.exports = mongoose.model("address", addressSchema);



// import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   fullName: String,
//   phone: String,
//   addressLine: String,
//   city: String,
//   state: String,
//   postalCode: String,
//   country: {
//     type: String,
//     default: "India"
//   }
// }, { timestamps: true });

// export default mongoose.model("Address", addressSchema);
