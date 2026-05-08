const userModel = require("../models/modUser");
const vendorModel = require("../models/modVendor");
const adminModel = require("../models/modAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// helper
const getModelByRole = (role) => {
  switch (role) {
    case "User":
      return userModel;

    case "Vendor":
      return vendorModel;

    case "Admin":
      return adminModel;

    default:
      return null;
  }
};

const getCookieName = (role) => {
  switch (role) {
    case "User":
      return "userToken";

    case "Vendor":
      return "vendorToken";

    case "Admin":
      return "adminToken";

    default:
      throw new Error("Invalid role");
  }
};

// signup
const create_user = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const Model = getModelByRole(role);

    if (!Model) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const emailLower = email.toLowerCase();

    // check only inside selected role
    const exists = await Model.findOne({
      email: emailLower,
    });

    if (exists) {
      return res.status(400).json({
        message: `${role} email already exists`,
      });
    }

    const new_password = await bcrypt.hash(password, 10);

    const data = await Model.create({
      name,
      email: emailLower,
      password: new_password,
      role,
    });

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const Model = getModelByRole(role);

    if (!Model) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await Model.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: `${role} not found`,
      });
    }

    const ismatch = await bcrypt.compare(password, user.password);

    if (!ismatch) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const cookieName = getCookieName(role);

    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// logout
const logout = async (req, res) => {
  try {
    const role = req.body.role || req.query.role;

    if (!role) {
      return res.status(400).json({
        message: "Role is required",
      });
    }

    const cookieName = getCookieName(role);

    res.clearCookie(cookieName, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.json({
      message: `Logged out successfully from ${role}`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// current user
const me = async (req, res) => {
  try {
    const { id, role } = req.user;

    const Model = getModelByRole(role);

    if (!Model) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    const user = await Model.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // If user role, also fetch their addresses
    let userWithAddresses = user.toObject();
    
    if (role === "User") {
      const modAddress = require("../models/modaddress");
      const addresses = await modAddress.find({ userid: id });
      userWithAddresses.addresses = addresses;
    }

    return res.json(userWithAddresses);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// for admin

// GET CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const customers = await userModel.find().select("-password");

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET VENDORS
const getVendors = async (req, res) => {
  try {
    const vendors = await vendorModel.find().select("-password");

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// resolve model by id
const findModelById = async (id) => {
  let user = await userModel.findById(id);
  if (user) {
    return {
      model: userModel,
      type: "User",
    };
  }

  let vendor = await vendorModel.findById(id);
  if (vendor) {
    return {
      model: vendorModel,
      type: "Vendor",
    };
  }

  return null;
};
// PATCH (shared)
const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const target = await findModelById(id);

    if (!target) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const updatedData =  await target.model
      .findByIdAndUpdate(id, req.body, {
        returnDocument: 'after',
        runValidators: true,
      })
      .select("-password");

    res.status(200).json({
      type: target.type,
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE (shared)
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const target = await findModelById(id);

    if (!target) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    await target.model.findByIdAndDelete(id);

    res.status(200).json({
      message: `${target.type} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//for user
const selfUpdateAccount = async (req, res) => {
  try {
    const { id, role } = req.user;

    const Model = getModelByRole(role);

    if (!Model) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const { name, email, phone, profileImage, password } = req.body;

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (email) {
      updateData.email = email.toLowerCase();
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }

    // optional password update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      updateData.password = hashedPassword;
    }

    // prevent role change
    delete updateData.role;

    const updatedUser = await Model.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    }).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  create_user,
  login,
  logout,
  me,
  getCustomers,
  getVendors,
  updateAccount,
  deleteAccount,
  selfUpdateAccount,
};
