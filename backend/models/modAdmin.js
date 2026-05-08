const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: false },
    role: { type: String, default: "Admin" },
    isactive: { type: Boolean, default: true },
    profileImage: { type: String, required: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("admin", adminSchema);

// //hashing before saving the password
// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await require("bcrypt").hash(this.password, 10);
//   next();
// });

// //checking password
// adminSchema.methods.comparePassword = async function (candidatePassword) {
//   return await require("bcrypt").compare(candidatePassword, this.password);
// };
