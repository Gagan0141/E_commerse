const modAllCategories = require("../models/modAllCategories");

//create
const create_category = async (req, res) => {
  try {
    const { title } = req.body;
    const exists = await modAllCategories.findOne({
      title: title.toLowerCase(),
    });
    if (exists) return res.status(400).json("category already exists");
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    const data = await modAllCategories.create({
      title: title.toLowerCase(),
      slug,
    });
    res.status(201).json(data);
  } catch (err) {
    console.log("error backend:", err);
    res.status(500).json({ message: "Error creating categories item" });
  }
};

//reading all categories
const getallcategories = async (req, res) => {
  try {
    const categories = await modAllCategories.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//soft delete
const soft_delete = async (req, res) => {
  try {
    const category = await modAllCategories.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { returnDocument: 'after' },
    );
    res.json(category);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//update
const updatecat = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedata = req.body;
    if (!id) return res.status(400).json({ message: "id reduired to update" });
    const updateddata = await modAllCategories.findByIdAndUpdate(
      id,
      updatedata,
      { returnDocument: 'after', runValidators: true },
    );
    if (!updateddata)
      return res.status(404).json({ message: "fields reduired to update" });
    res.json(updateddata);
  } catch (error) {
    res.status(500).json({ message: "err while updating" });
  }
};

module.exports = {
  create_category,
  getallcategories,
  soft_delete,
  updatecat,
};
