// const express = require("express");
// const router = express.Router();
// const Category = require("../models/modCategory");

// // GET all categories
// router.get("/", async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET categories by group
// router.get("/:group", async (req, res) => {
//   try {
//     let group = req.params.group;

//     // ✅ Fix case mismatch
//     if (group === "") group = "For You";
//     else {
//       group = group.charAt(0).toUpperCase() + group.slice(1);
//     }

//     const categories = await Category.find({ group });

//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;