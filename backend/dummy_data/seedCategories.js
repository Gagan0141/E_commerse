const mongoose = require("mongoose");
const Category = require("../models/modCategory.js");
const Product = require("../models/modProducts.js");

const MONGO_URI = "mongodb://127.0.0.1:27017/E-com";

const groupIcons = {
  "For You":
    "https://img.icons8.com/?size=100&id=492ILERveW8G&format=png&color=000000",
  Fashion:
    "https://img.icons8.com/?size=100&id=nr3bIWoY2G1H&format=png&color=000000",
  Mobiles:
    "https://img.icons8.com/?size=100&id=L9ByuHGgbUNK&format=png&color=000000",
  Beauty:
    "https://img.icons8.com/?size=100&id=IBrm3QaSliRg&format=png&color=000000",
  Electronics:
    "https://img.icons8.com/?size=100&id=X54sJDVZjd5c&format=png&color=000000",
  Home: "https://img.icons8.com/?size=100&id=iJzm3AFQCS4W&format=png&color=000000",
  Appliances:
    "https://img.icons8.com/?size=100&id=qKnbLWFNOYhY&format=png&color=000000",
  Toys: "https://img.icons8.com/?size=100&id=Ij6e8EAIOIeX&format=png&color=000000",
  Food: "https://img.icons8.com/?size=100&id=rXA7TNJacKXj&format=png&color=000000",
  Sports:
    "https://img.icons8.com/?size=100&id=7pqwzC04TRDz&format=png&color=000000",
};

const categorySeed = [
  { name: "Clothing and Accessories", group: "Fashion" },
  { name: "Footwear", group: "Fashion" },
  { name: "Mobiles & Accessories", group: "Mobiles" },
  { name: "Beauty and Grooming", group: "Beauty" },
  { name: "Computers", group: "Electronics" },
  { name: "Furniture", group: "Home" },
  { name: "Health & Personal Care Appliances", group: "Appliances" },
  { name: "Toys", group: "Toys" },
  { name: "Food Products", group: "Food" },
  { name: "Sports", group: "Sports" },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    // 1. Reset DB
    await Category.deleteMany();
    await Product.deleteMany();

    // 2. Insert categories with icons
    const insertedCategories = await Category.insertMany(
      categorySeed.map((cat) => ({
        ...cat,
        icon: groupIcons[cat.group],
      })),
    );

    // 3. Create map from DB (correct way)
    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // 4. Create products
    const products = [
      // Fashion
      {
        title: "Men Cotton T-Shirt",
        price: 499,
        stock: 50,
        category: categoryMap["Clothing and Accessories"],
        images: ["https://via.placeholder.com/300"],
        brand: "Zara",
      },
      {
        title: "Running Shoes",
        price: 1499,
        stock: 30,
        category: categoryMap["Footwear"],
        images: ["https://via.placeholder.com/300"],
        brand: "Nike",
      },

      // Mobiles
      {
        title: "iPhone 14",
        price: 69999,
        stock: 20,
        category: categoryMap["Mobiles & Accessories"],
        images: ["https://via.placeholder.com/300"],
        brand: "Apple",
      },
      {
        title: "Smart Watch Pro",
        price: 2999,
        stock: 40,
        category: categoryMap["Wearable Smart Devices"],
        images: ["https://via.placeholder.com/300"],
        brand: "Noise",
      },

      // Electronics
      {
        title: "Gaming Laptop",
        price: 89999,
        stock: 10,
        category: categoryMap["Computers"],
        images: ["https://via.placeholder.com/300"],
        brand: "Asus",
      },
      {
        title: "Bluetooth Speaker",
        price: 1999,
        stock: 60,
        category: categoryMap["Audio & Video"],
        images: ["https://via.placeholder.com/300"],
        brand: "JBL",
      },

      // Home
      {
        title: "Wooden Sofa",
        price: 15999,
        stock: 5,
        category: categoryMap["Furniture"],
        images: ["https://via.placeholder.com/300"],
        brand: "Urban Ladder",
      },
      {
        title: "LED Ceiling Light",
        price: 799,
        stock: 25,
        category: categoryMap["Home Lighting"],
        images: ["https://via.placeholder.com/300"],
        brand: "Philips",
      },

      // Beauty
      {
        title: "Face Wash",
        price: 299,
        stock: 100,
        category: categoryMap["Beauty and Grooming"],
        images: ["https://via.placeholder.com/300"],
        brand: "Nivea",
      },

      // Toys
      {
        title: "Remote Control Car",
        price: 999,
        stock: 35,
        category: categoryMap["Toys"],
        images: ["https://via.placeholder.com/300"],
        brand: "Funskool",
      },

      // Sports
      {
        title: "Cricket Bat",
        price: 1299,
        stock: 15,
        category: categoryMap["Sports"],
        images: ["https://via.placeholder.com/300"],
        brand: "SG",
      },

      // Food
      {
        title: "Organic Honey",
        price: 499,
        stock: 80,
        category: categoryMap["Food Products"],
        images: ["https://via.placeholder.com/300"],
        brand: "Patanjali",
      },

      {
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
          "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      },
      {
        title: "Mens Casual Premium Slim Fit T-Shirts",
        price: 22.3,
        description:
          "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing...",
        category: categoryMap["Clothing and Accessories"],
        image:
          "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
      },
      {
        title: "Mens Cotton Jacket",
        price: 55.99,
        description:
          "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions such as working, hiking, camping...",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
      },
      {
        title: "Mens Casual Slim Fit",
        price: 15.99,
        description:
          "The color could be slightly different between on the screen and in practice...",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
      },

      {
        title: "John Hardy Women's Legends Naga Bracelet",
        price: 695,
        description:
          "From our Legends Collection, the Naga was inspired by the mythical water dragon...",
        category: categoryMap["Clothing and Accessories"],
        image:
          "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
      },
      {
        title: "Solid Gold Petite Micropave",
        price: 168,
        description:
          "Satisfaction Guaranteed. Return or exchange any order within 30 days...",
        category: categoryMap["Clothing and Accessories"],
        image:
          "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
      },
      {
        title: "White Gold Plated Princess Ring",
        price: 9.99,
        description:
          "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her...",
        category: categoryMap["Clothing and Accessories"],
        image:
          "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png",
      },
      {
        title: "Pierced Owl Rose Gold Earrings",
        price: 10.99,
        description: "Rose Gold Plated Double Flared Tunnel Plug Earrings...",
        category: categoryMap["Clothing and Accessories"],
        image:
          "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png",
      },

      {
        title: "WD 2TB External Hard Drive",
        price: 64,
        description:
          "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance...",
        category: categoryMap["Mobiles & Accessories"],
        image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
      },
      {
        title: "SanDisk SSD PLUS 1TB",
        price: 109,
        description:
          "Easy upgrade for faster boot up, shutdown, application load and response...",
        category: categoryMap["Computers"],
        image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
      },
      {
        title: "Silicon Power 256GB SSD",
        price: 109,
        description:
          "3D NAND flash are applied to deliver high transfer speeds...",
        category: categoryMap["Computers"],
        image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png",
      },
      {
        title: "WD 4TB Gaming Drive",
        price: 114,
        description:
          "Expand your PS4 gaming experience, Play anywhere Fast and easy setup...",
        category: categoryMap["Mobiles & Accessories"],
        image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
      },
      {
        title: 'Acer 21.5" Full HD Monitor',
        price: 599,
        description:
          "21.5 inches Full HD IPS display with Radeon FreeSync technology...",
        category: categoryMap["Computers"],
        image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png",
      },
      {
        title: "Samsung 49-Inch Curved Gaming Monitor",
        price: 999.99,
        description:
          "49 inch super ultrawide curved gaming monitor with QLED technology...",
        category: categoryMap["Computers"],
        image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
      },

      {
        title: "Women's 3-in-1 Snowboard Jacket",
        price: 56.99,
        description: "Detachable liner fabric, warm fleece, adjustable hood...",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
      },
      {
        title: "Women's Faux Leather Moto Jacket",
        price: 29.95,
        description:
          "Faux leather material for style and comfort with hooded design...",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
      },
      {
        title: "Women's Windbreaker Rain Jacket",
        price: 39.99,
        description: "Lightweight jacket with hood, adjustable waist design...",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
      },
      {
        title: "Women's Boat Neck T-Shirt",
        price: 9.85,
        description:
          "Lightweight fabric with stretch, ribbed sleeves and neckline...",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
      },
      {
        title: "Women's Moisture Wicking T-Shirt",
        price: 7.95,
        description:
          "Highly breathable fabric with moisture wicking technology...",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png",
      },
      {
        title: "DANVOUY Women's Casual T-Shirt",
        price: 12.99,
        description:
          "Soft cotton fabric with stretch, suitable for casual and office wear...",
        category: categoryMap["Clothing and Accessories"],
        image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png",
      },
    ];

    // await Product.deleteMany(); // optional
    await Product.insertMany(products);

    console.log("✅ Categories + Products Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedProducts();

// import mongoose from "mongoose";
// import Category from "../models/modCategory.js";
// import Product from "../models/modProducts.js";

// const MONGO_URI = "mongodb://127.0.0.1:27017/E-com";

// const seedProducts = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);

//     const categories = await Category.find();

//     // Map category name → _id
//     const categoryMap = {};
//     categories.forEach((cat) => {
//       categoryMap[cat.name] = cat._id;
//     });

//     const products = [
//       // Fashion
//       {
//         title: "Men Cotton T-Shirt",
//         price: 499,
//         stock: 50,
//         category: categoryMap["Clothing and Accessories"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Zara",
//       },
//       {
//         title: "Running Shoes",
//         price: 1499,
//         stock: 30,
//         category: categoryMap["Footwear"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Nike",
//       },

//       // Mobiles
//       {
//         title: "iPhone 14",
//         price: 69999,
//         stock: 20,
//         category: categoryMap["Mobiles & Accessories"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Apple",
//       },
//       {
//         title: "Smart Watch Pro",
//         price: 2999,
//         stock: 40,
//         category: categoryMap["Wearable Smart Devices"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Noise",
//       },

//       // Electronics
//       {
//         title: "Gaming Laptop",
//         price: 89999,
//         stock: 10,
//         category: categoryMap["Computers"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Asus",
//       },
//       {
//         title: "Bluetooth Speaker",
//         price: 1999,
//         stock: 60,
//         category: categoryMap["Audio & Video"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "JBL",
//       },

//       // Home
//       {
//         title: "Wooden Sofa",
//         price: 15999,
//         stock: 5,
//         category: categoryMap["Furniture"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Urban Ladder",
//       },
//       {
//         title: "LED Ceiling Light",
//         price: 799,
//         stock: 25,
//         category: categoryMap["Home Lighting"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Philips",
//       },

//       // Beauty
//       {
//         title: "Face Wash",
//         price: 299,
//         stock: 100,
//         category: categoryMap["Beauty and Grooming"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Nivea",
//       },

//       // Toys
//       {
//         title: "Remote Control Car",
//         price: 999,
//         stock: 35,
//         category: categoryMap["Toys"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Funskool",
//       },

//       // Sports
//       {
//         title: "Cricket Bat",
//         price: 1299,
//         stock: 15,
//         category: categoryMap["Sports"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "SG",
//       },

//       // Food
//       {
//         title: "Organic Honey",
//         price: 499,
//         stock: 80,
//         category: categoryMap["Food Products"],
//         images: ["https://via.placeholder.com/300"],
//         brand: "Patanjali",
//       },
//     ];

//     await Product.deleteMany(); // optional
//     await Product.insertMany(products);

//     console.log("✅ Products Seeded Successfully");
//     process.exit();
//   } catch (error) {
//     console.error("❌ Error:", error);
//     process.exit(1);
//   }
// };

// seedProducts();

// // import mongoose from "mongoose";
// // import Category from "../models/modCategory.js";

// // const MONGO_URI = "mongodb://127.0.0.1:27017/E-com";

// // const categories = [
// //   // Fashion
// //   { name: "Clothing and Accessories", group: "Fashion" },
// //   { name: "Footwear", group: "Fashion" },
// //   { name: "Watches", group: "Fashion" },
// //   { name: "Jewellery", group: "Fashion" },
// //   { name: "Sunglasses", group: "Fashion" },
// //   { name: "Bags, Wallets & Belts", group: "Fashion" },

// //   // Mobiles
// //   { name: "Mobiles & Accessories", group: "Mobiles" },
// //   { name: "Wearable Smart Devices", group: "Mobiles" },

// //   // Beauty
// //   { name: "Beauty and Grooming", group: "Beauty" },
// //   { name: "Health Care", group: "Beauty" },

// //   // Electronics
// //   { name: "Computers", group: "Electronics" },
// //   { name: "Cameras & Accessories", group: "Electronics" },
// //   { name: "Gaming", group: "Electronics" },
// //   { name: "Audio & Video", group: "Electronics" },
// //   { name: "Home Entertainment", group: "Electronics" },

// //   // Home
// //   { name: "Home & Kitchen", group: "Home" },
// //   { name: "Home Decor", group: "Home" },
// //   { name: "Furniture", group: "Home" },
// //   { name: "Home Furnishing", group: "Home" },
// //   { name: "Home Lighting", group: "Home" },
// //   { name: "Home Cleaning & Bathroom Accessories", group: "Home" },

// //   // Appliances
// //   { name: "Health & Personal Care Appliances", group: "Appliances" },

// //   // Toys
// //   { name: "Toys", group: "Toys" },
// //   { name: "Toys and Games", group: "Toys" },
// //   { name: "Kids Accessories", group: "Toys" },

// //   // Food
// //   { name: "Food Products", group: "Food" },

// //   // Sports
// //   { name: "Sports", group: "Sports" },
// //   { name: "Exercise & Fitness", group: "Sports" },

// //   // For You (mixed/default)
// //   { name: "Pet Supplies", group: "For You" },
// //   { name: "Baby Care", group: "For You" },
// // ];

// // const seedData = async () => {
// //   try {
// //     await mongoose.connect(MONGO_URI);

// //     await Category.deleteMany(); // optional (clears old data)

// //     await Category.insertMany(categories);

// //     console.log("✅ Categories Seeded Successfully");
// //     process.exit();
// //   } catch (error) {
// //     console.error("❌ Error seeding data:", error);
// //     process.exit(1);
// //   }
// // };

// // seedData();
