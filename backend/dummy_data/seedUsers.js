const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/modUser.js");

const MONGO_URI = "mongodb://127.0.0.1:27017/E-com";

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    // Clear existing users
    await User.deleteMany();

    // Create test users with different roles
    const testUsers = [
      {
        name: "Admin User",
        email: "admin@test.com",
        password: "password123",
        role: "Admin",
        isactive: true,
        isverified: true,
      },
      {
        name: "Vendor User",
        email: "vendor@test.com",
        password: "password123",
        role: "Vendor",
        isactive: true,
        isverified: true,
      },
      {
        name: "Regular User",
        email: "user@test.com",
        password: "password123",
        role: "User",
        isactive: true,
        isverified: true,
      },
    ];

    // Hash passwords and insert users
    const usersWithHashedPasswords = await Promise.all(
      testUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const insertedUsers = await User.insertMany(usersWithHashedPasswords);
    console.log("✅ Users seeded successfully!");
    insertedUsers.forEach((user) => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    process.exit(1);
  }
};

seedUsers();
