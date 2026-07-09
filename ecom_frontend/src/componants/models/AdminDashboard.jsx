import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/dashboard", {
        headers: {
          role: "admin",
        },
      });

      setDashboard(res.data);
    } catch (err) {
      console.log(err);
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        title: "Revenue",
        value: `₹${dashboard.stats.revenue.toLocaleString()}`,
        // change: dashboard.stats.revenueGrowth || "+0%",
        color: "text-green-600",
      },
      {
        title: "Orders",
        value: dashboard.stats.orders,
        change: `${dashboard.stats.pendingOrders} Pending`,
        color: "text-blue-600",
      },
      {
        title: "Customers",
        value: dashboard.stats.customers,
        change: `${dashboard.stats.newCustomers || 0} New`,
        color: "text-purple-600",
      },
      {
        title: "Products",
        value: dashboard.stats.products,
        change: `${dashboard.stats.lowStock} Low Stock`,
        color: "text-orange-600",
      },
      {
        title: "Vendors",
        value: dashboard.stats.vendors,
        change: `${dashboard.stats.activeVendors || 0} Active`,
        color: "text-pink-600",
      },
      {
        title: "Conversion",
        value: `${dashboard.stats.conversion || 0}%`,
        change: "Current",
        color: "text-cyan-600",
      },
    ];
  }, [dashboard]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="text-red-600 font-semibold">{error}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
          >
            <p className="text-slate-500 text-sm">{item.title}</p>

            <h2 className="text-3xl font-bold mt-3 text-slate-900">
              {item.value}
            </h2>

            <p className={`mt-3 font-medium ${item.color}`}>{item.change}</p>
          </div>
        ))}
      </div>

      {/* SALES CHART */}
{/* 
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Sales Overview</h2>

          <button
            onClick={fetchDashboard}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
          >
            Refresh
          </button>
        </div>

        <div className="h-80 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-500">
          Chart.js Graph Here
        </div>
      </div> */}
      {/* RECENT ORDERS + TOP PRODUCTS */}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* RECENT ORDERS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>

            <button className="text-blue-600 hover:underline">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-slate-500">
                  <th className="py-3">Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {dashboard?.recentOrders?.length ? (
                  dashboard.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b last:border-none hover:bg-slate-50"
                    >
                      <td className="py-4 font-semibold">
                        #{order.orderNumber || order._id.slice(-6)}
                      </td>

                      <td>{order.user?.name || "Guest"}</td>

                      <td>₹{order.totalPrice}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-slate-400"
                    >
                      No Orders Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP SELLING PRODUCTS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Top Selling Products</h2>

            <button className="text-blue-600 hover:underline">View All</button>
          </div>

          <div className="space-y-5">
            {dashboard?.topProducts?.length ? (
              dashboard.topProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-4">
                  <img
                    src={product.image?.[0]}
                    alt={product.title}
                    className="w-14 h-14 rounded-xl object-cover border"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{product.title}</h3>

                    <p className="text-sm text-slate-500">
                      {product.sold} Sold
                    </p>

                    <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-full"
                        style={{
                          width: `${Math.min(product.sold, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-10">
                No Product Data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOW STOCK + ACTIVITY */}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LOW STOCK */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Low Stock Products</h2>

            <span className="text-sm text-red-500">
              {dashboard?.lowStockProducts?.length || 0} Items
            </span>
          </div>

          <div className="space-y-4">
            {dashboard?.lowStockProducts?.length ? (
              dashboard.lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image?.[0]}
                      className="w-12 h-12 rounded-lg object-cover"
                      alt=""
                    />

                    <div>
                      <p className="font-semibold">{product.title}</p>

                      <p className="text-sm text-slate-500">₹{product.price}</p>
                    </div>
                  </div>

                  <span className="text-red-600 font-bold">
                    {product.stock} Left
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                All products are sufficiently stocked.
              </div>
            )}
          </div>
        </div>
        {/* RECENT ACTIVITY */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>

            <button
              onClick={fetchDashboard}
              className="text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-5">
            {dashboard?.recentActivity?.length ? (
              dashboard.recentActivity.map((activity) => (
                <div key={activity._id} className="flex gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-2"></div>

                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>

                    <p className="text-sm text-slate-500">
                      {activity.description}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                No Recent Activity
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <button className="bg-slate-100 hover:bg-slate-200 rounded-2xl p-6 transition">
            <div className="text-3xl mb-3">📦</div>

            <p className="font-semibold">Products</p>
          </button>

          <button className="bg-slate-100 hover:bg-slate-200 rounded-2xl p-6 transition">
            <div className="text-3xl mb-3">🛒</div>

            <p className="font-semibold">Orders</p>
          </button>

          <button className="bg-slate-100 hover:bg-slate-200 rounded-2xl p-6 transition">
            <div className="text-3xl mb-3">👥</div>

            <p className="font-semibold">Customers</p>
          </button>

          <button className="bg-slate-100 hover:bg-slate-200 rounded-2xl p-6 transition">
            <div className="text-3xl mb-3">🏪</div>

            <p className="font-semibold">Vendors</p>
          </button>
        </div>
      </div>
    </div>
  );
}
