const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: false },
    role: { type: String, default: "User" },
    isactive: { type: Boolean, default: true },
    profileImage: { type: String, required: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);

// //hashing before saving the password
// userSchema.pre("save", async (next) => {
//   if (!this.isModified(password)) return next();
//   this.password = await bcrypt.hash(this.password, 42);
//   next();
// });

// //checking password
// userSchema.method.comparePassword = async (candidatePassword) => {
//   await bcrypt.compare(candidatePassword, this.password);
// };
