import React, { useState, useEffect } from "react";
import api from "../api/axios";
// import TopNavbar from "../navbar/TopNavbar";
import { useAuth } from "../utils/Auth";
import Address from "../models/Address";
import MyOrders from "../user_tabs/MyOrders";
import Dashboard from "../user_tabs/Dashboard";

export default function User() {
  const [activeTab, setActiveTab] = useState("dashboard");
  // const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { auth } = useAuth();

  const user = auth.user;
  const navigationItems = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "orders", name: "My Orders", icon: "📦" },
    { id: "products", name: "Products", icon: "🛍️" },
    { id: "addresses", name: "Addresses", icon: "🏠" },
    { id: "account", name: "Account", icon: "👤" },
    { id: "analytics", name: "Analytics", icon: "📈" },
    { id: "settings", name: "Settings", icon: "⚙️" },
  ];

  useEffect(() => {
    if (!auth.userToken || !user) {
      return;
    }

    fetchDashboardData();
  }, [auth.userToken, user]);

  const fetchDashboardData = async () => {
    if (!auth.userToken) {
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          "x-role": "User",
        },
      };

      const [orderRes, reviewRes, addressRes] = await Promise.all([
        api.get("/api/order/my", config),

        api.get("/api/review/user", config),

        api.get("/api/address", config),
      ]);

      setOrders(orderRes.data || []);

      setReviews(reviewRes.data || []);

      setAddresses(addressRes.data || []);

      setEditData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    } catch (error) {
      // Error fetching user data
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.patch("/api/auth/update", editData, {
        headers: {
          "x-role": "User",
        },
      });

      alert("Account updated successfully");
    } catch (error) {
      // Error updating account

      alert(error?.response?.data?.message || "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: "📦",
    },
    {
      title: "Total Reviews",
      value: reviews.length,
      icon: "⭐",
    },
    {
      title: "Saved Addresses",
      value: addresses.length,
      icon: "🏠",
    },
    {
      title: "Delivered Orders",
      value: orders.filter((o) => o.status === "Delivered").length,
      icon: "✅",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full px-4 md:px-[10%] py-6 gap-6">
        <div className="w-full md:w-1/4 flex flex-col gap-4 sticky top-6 h-fit">
          <div className="w-full min-h-20 mb-4 shadow-md bg-white rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="w-full min-h-20 mb-4 shadow-md bg-white rounded-xl p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full md:w-3/4 flex flex-col gap-6 z-10 bg-gray-100">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "orders" && <MyOrders />}

          {activeTab === "account" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Account Settings
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Manage your personal information
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleAccountUpdate}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-xl px-4 py-3"
                />

                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="border border-gray-300 rounded-xl px-4 py-3"
                />

                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                  placeholder="Phone"
                  className="border border-gray-300 rounded-xl px-4 py-3 md:col-span-2"
                />

                <button
                  type="submit"
                  disabled={saving}
                  className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                  🏠
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Manage Addresses
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Add, edit, or delete your delivery addresses
                  </p>
                </div>
              </div>

              <Address />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
