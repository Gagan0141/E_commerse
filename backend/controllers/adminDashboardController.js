const Product = require("../models/modProducts");
const Order = require("../models/modOrder");
const User = require("../models/modUser");

const getDashboard = async (req, res) => {
  try {
    const [products, customers, vendors, orders, pendingOrders, lowStock] =
      await Promise.all([
        Product.countDocuments(),
        User.countDocuments({ role: "User" }),
        User.countDocuments({ role: "Vendor" }),
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Product.countDocuments({
          stock: { $lt: 10 },
        }),
      ]);

    // Revenue
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: {
            $in: ["approved", "shipped", "delivered"],
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].revenue : 0;

    // Recent Orders
    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // Low Stock Products
    const lowStockProducts = await Product.find({
      stock: { $lt: 10 },
    })
      .select("title stock image price")
      .limit(5);

    // Top Selling Products
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: {
            $in: ["approved", "shipped", "delivered"],
          },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product",
          sold: {
            $sum: "$items.quantity",
          },
        },
      },
      {
        $sort: {
          sold: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: "$product._id",
          title: "$product.title",
          image: "$product.image",
          sold: 1,
        },
      },
    ]);

    const recentActivity = [
      {
        _id: 1,
        title: "New Product Added",
        description: "Latest product was added.",
        time: "Just now",
      },
      {
        _id: 2,
        title: "Order Received",
        description: "A new order has been placed.",
        time: "5 minutes ago",
      },
      {
        _id: 3,
        title: "Vendor Registered",
        description: "A vendor account was created.",
        time: "30 minutes ago",
      },
    ];

    res.status(200).json({
      stats: {
        revenue,
        revenueGrowth: "+0%",
        orders,
        pendingOrders,
        customers,
        newCustomers: 0,
        products,
        lowStock,
        vendors,
        activeVendors: vendors,
        conversion: 0,
      },
      recentOrders,
      topProducts,
      lowStockProducts,
      recentActivity,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load dashboard",
      error: err.message,
    });
  }
};


module.exports = {
  getDashboard,
};
