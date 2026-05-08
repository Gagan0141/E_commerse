import { useState, useEffect } from "react";
import api from "../api/axios";
import NavModal from "../models/AddNavModel";
import CategoryModal from "../models/AddCategoryModel";
import ProductModal from "../models/AddProductModel";
import { useAuth } from "../utils/Auth";
import Productsdashboard from "../models/ProductsDashboard";
import NavItemsDashboard from "../models/NavItemsDashboard";
import CategoriesDashboard from "../models/CategoriesDashboard";
import CustomersDashboard from "../models/CustomersDashboard";
import VendorsDashboard from "../models/VendorsDashboard";

export default function Admin() {
  const [activeModal, setactiveModal] = useState(null);
  const [activeTab, setActiveTab] = useState("Nav control");
  const [loading, setloading] = useState(false);

  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    discountPercentage: "",
    category: "",
    categories: [],
    image: "",
  });
  //nav start
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/cat");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      if (activeModal === "nav") {
        const response = await api.post("/nav/add", {
          ...form,
          role: user.role,
        });
        console.log("Success:", response.data);
      }

      if (activeModal === "cat") {
        const response = await api.post("/cat/add", {
          ...form,
          role: user.role,
        });
        console.log("Success:", response.data);
      }

      if (activeModal === "product") {
        const response = await api.post("/product/add", {
          ...form,
          role: user.role,
        });
        console.log("Success:", response.data);
      }

      setactiveModal(null);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  const opennavModal = () => {
    setForm({
      title: "",
      categories: [],
    });

    setloading(false);
    setactiveModal("nav");
  };

  const closenavModal = () => {
    setactiveModal(null);
  };

  const opencategoryModal = () => {
    setForm({
      title: "",
    });
    setloading(false);
    setactiveModal("cat");
  };

  const closecategoryModal = () => {
    setactiveModal(null);
  };

  const openProductModal = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      discountPercentage: "",
      stock: "",
      category: "",
      image: "",
    });
    setloading(false);
    setactiveModal("product");
  };

  const closeProductModal = () => {
    setactiveModal(null);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && activeModal) {
        setactiveModal(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeModal]);

  const menuItems = [
    "dashboard",
    "Nav control",
    "products",
    "categories",
    "orders",
    "customers",
    "vendors",
    "analytics",
    "marketing",
    "settings",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3 xl:col-span-2">
            <div className="sticky top-4 h-[calc(100vh-2rem)] bg-white border border-slate-200 rounded-3xl p-5 flex flex-col shadow-sm">
              {/* Profile */}
              <div className="pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0)}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Admin Panel
                    </p>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {user?.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex-1 overflow-y-auto no-scrollbar">
                <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 px-2">
                  Navigation
                </p>

                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li
                      key={item}
                      onClick={() => setActiveTab(item)}
                      className={`group cursor-pointer px-4 py-3 rounded-2xl transition-all duration-200 flex items-center justify-between ${
                        activeTab === item
                          ? "bg-slate-900 text-white shadow-md"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="capitalize font-medium">{item}</span>

                      {activeTab === item && (
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <a
                  href="/"
                  className="block text-center w-full bg-slate-100 hover:bg-slate-200 rounded-2xl py-3 transition font-medium"
                >
                  Home
                </a>

                <button
                  onClick={logout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-3 font-semibold transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 xl:col-span-10">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 capitalize">
                {activeTab}
              </h1>
              <p className="text-slate-500 mt-1">
                Manage and monitor platform operations
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 min-h-screen">
              {/* NAV CONTROL */}
              {activeTab === "Nav control" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-slate-900">
                    Admin Actions
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={opennavModal}
                      className="flex flex-col items-start p-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition"
                    >
                      <span className="text-sm text-slate-500">Navigation</span>
                      <span className="text-lg font-semibold text-slate-900">
                        Add Nav Item
                      </span>
                    </button>

                    <button
                      onClick={opencategoryModal}
                      className="flex flex-col items-start p-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition"
                    >
                      <span className="text-sm text-slate-500">Category</span>
                      <span className="text-lg font-semibold text-slate-900">
                        Add Category
                      </span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 bg-white overflow-x-auto">
                    <NavItemsDashboard />
                  </div>
                </div>
              )}

              {/* DASHBOARD */}
              {activeTab === "dashboard" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-slate-900">
                    Overview
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {["Revenue", "Orders", "Customers", "Conversion"].map(
                      (kpi) => (
                        <div
                          key={kpi}
                          className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-sm transition"
                        >
                          <p className="text-sm text-slate-500">{kpi}</p>
                          <p className="text-2xl font-bold mt-3 text-slate-900">
                            --
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              {activeTab === "products" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Products</h2>

                    <button
                      onClick={openProductModal}
                      className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition"
                    >
                      Add Product
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 overflow-x-auto">
                    <Productsdashboard form={form} setForm={setForm} />
                  </div>
                </div>
              )}

              {/* CATEGORIES */}
              {activeTab === "categories" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Categories</h2>

                    <button
                      onClick={opencategoryModal}
                      className="bg-slate-900 text-white px-5 py-2.5 rounded-xl"
                    >
                      Add Category
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 overflow-x-auto">
                    <CategoriesDashboard />
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Orders</h2>

                  <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 text-slate-500">
                    Orders table (status, payment, user, total)
                  </div>
                </div>
              )}

              {/* CUSTOMERS */}
              {activeTab === "customers" && (
                <div className="rounded-2xl border border-slate-200 p-4 overflow-x-auto">
                  <CustomersDashboard />
                </div>
              )}

              {/* VENDORS */}
              {activeTab === "vendors" && (
                <div className="rounded-2xl border border-slate-200 p-4 overflow-x-auto">
                  <VendorsDashboard />
                </div>
              )}

              {/* ANALYTICS */}
              {activeTab === "analytics" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Analytics</h2>

                  <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 text-slate-500">
                    Charts: sales trends, top products
                  </div>
                </div>
              )}

              {/* MARKETING */}
              {activeTab === "marketing" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Marketing</h2>

                  <div className="space-y-4">
                    <button className="w-full sm:w-auto bg-slate-100 px-5 py-3 rounded-xl hover:bg-slate-200 transition">
                      Manage Coupons
                    </button>

                    <button className="w-full sm:w-auto bg-slate-100 px-5 py-3 rounded-xl hover:bg-slate-200 transition">
                      Homepage Banners
                    </button>
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Settings</h2>

                  <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 text-slate-500">
                    Payment, shipping, tax configuration
                  </div>

                  <div className="flex mt-8 justify-start">
                    <button
                      onClick={() => logout()}
                      className="bg-red-500 text-white rounded-xl px-6 py-3 hover:bg-red-600 transition"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals remain untouched */}
      <NavModal
        activeModal={activeModal}
        closenavModal={closenavModal}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        loading={loading}
        categories={categories}
      />

      <CategoryModal
        activeModal={activeModal}
        closecategoryModal={closecategoryModal}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      <ProductModal
        activeModal={activeModal}
        closeModal={closeProductModal}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
