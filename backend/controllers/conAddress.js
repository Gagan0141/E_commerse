const modAddress = require("../models/modaddress");

const createAddress = async (req, res) => {
  try {
    const { street, city, state, pincode, type, isDefault } = req.body;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({
        message: "All required fields are needed",
      });
    }

    if (isDefault) {
      await modAddress.updateMany(
        { userid: req.user.id },
        { isDefault: false },
      );
    }

    const address = await modAddress.create({
      street,
      city,
      state,
      pincode,
      type,
      isDefault,
      userid: req.user.id,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAddresses = async (req, res) => {
  try {
    const addresses = await modAddress.find({
      userid: req.user.id,
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleAddress = async (req, res) => {
  try {
    const address = await modAddress.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (address.userid.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await modAddress.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (address.userid.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (req.body.isDefault) {
      await modAddress.updateMany(
        { userid: req.user.id },
        { isDefault: false },
      );
    }

    const updated = await modAddress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' },
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await modAddress.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (address.userid.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await address.deleteOne();

    res.json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const address = await modAddress.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await modAddress.updateMany(
      { userid: req.user.id },
      { isDefault: false },
    );

    address.isDefault = true;
    await address.save();

    res.json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAddress,
  getAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};