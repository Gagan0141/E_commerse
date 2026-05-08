const navModel = require("../models/modNav");
const categoryModel = require("../models/modAllCategories");

const createnav = async (req, res) => {
  try {
    const { title, categories } = req.body;

    if (!title || !categories || categories.length === 0) {
      return res.status(400).json({
        message: "title and categories are required",
      });
    }

    const categoryExists = await categoryModel.find({
      _id: { $in: categories },
    });

    if (categoryExists.length !== categories.length) {
      return res.status(400).json({
        message: "one or more categories are invalid",
      });
    }

    const newNav = await navModel.create({
      title,
      categories,
    });

    const populatedNav = await navModel
      .findById(newNav._id)
      .populate("categories");

    res.status(201).json(populatedNav);
  } catch (err) {
    console.log("error backend:", err);
    res.status(500).json({
      message: "Error creating nav item",
    });
  }
};

const getnavitems = async (req, res) => {
  try {
    const data = await navModel.find().populate("categories");
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching nav items",
    });
  }
};

const updatenav = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, categories } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "navigation id is required",
      });
    }

    if (categories && categories.length > 0) {
      const categoryExists = await categoryModel.find({
        _id: { $in: categories },
      });

      if (categoryExists.length !== categories.length) {
        return res.status(400).json({
          message: "one or more categories are invalid",
        });
      }
    }

    const updatedNav = await navModel
      .findByIdAndUpdate(
        id,
        {
          title,
          categories,
        },
        {
          new: true,
          runValidators: true,
        }
      )
      .populate("categories");

    if (!updatedNav) {
      return res.status(404).json({
        message: "navigation item not found",
      });
    }

    res.json(updatedNav);
  } catch (err) {
    res.status(500).json({
      message: "error updating nav item",
    });
  }
};

const deletenav = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "id required to delete",
      });
    }

    const deletedItem = await navModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        message: "item not found",
      });
    }

    res.json({
      message: "item deleted successfully",
      deletedItem,
    });
  } catch (err) {
    res.status(500).json({
      message: "error deleting item",
    });
  }
};

module.exports = {
  createnav,
  getnavitems,
  updatenav,
  deletenav,
};