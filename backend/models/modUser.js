const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["User", "Admin", "Vendor"],
      default: "User",
    },
    isactive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

// //hashing before saving the password
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await require("bcrypt").hash(this.password, 10);
//   next();
// });

// //checking password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await require("bcrypt").compare(candidatePassword, this.password);
// };
