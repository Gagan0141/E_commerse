const navModel = require("../models/modNav");

const createnav = async (req, res) => {
  try {
    const { title, imgurl, path } = req.body;
    const newNav = await navModel.create({
      title,
      imgurl,
      path,
    });
    res.status(201).json(newNav);
  } catch (err) {
    console.log("error backend:", err);
    res.status(500).json({ message: "Error creating nav item" });
  }
};

const getnavitems = async (req, res) => {
  const data = await navModel.find();
  res.json(data);
};

const updatenav = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedata = req.body;
    if (!id) {
      return res.status(400).json({ message: "navigation id is required" });
    }
    const updatednav = await navModel.findByIdAndUpdate(id, updatedata, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!updatednav) {
      return res.status(404).json({ message: "navigation item is required" });
    }
    res.json(updatednav);
  } catch (err) {
    res.status(500).json({ message: "error updating nav item" });
  }
};

const deletenav = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id required to delete" });
    const deleteditem = await navModel.findByIdAndDelete(id);
    if (!deleteditem)
      return res.status(404).json({ message: "item not found" });
    res.json({ message: "item deleted successfully", deleteditem });
  } catch (err) {
    res.status(500).json({ message: "error deleting item" });
  }
};

module.exports = { createnav, getnavitems, updatenav, deletenav };
