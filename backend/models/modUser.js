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
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
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
      default: null,
    },

    isverified: {
      type: Boolean,
      default: false,
    },

    refreshTokens: {
      User: {
        type: String,
        default: null,
      },

      Vendor: {
        type: String,
        default: null,
      },

      Admin: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
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
