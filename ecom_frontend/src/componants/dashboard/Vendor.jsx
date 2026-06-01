import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductModal from "../models/AddProductModel";
import { useAuth } from "../utils/Auth";
import Productsdashboard from "../models/ProductsDashboard";

export default function Vendor() {
  const [activeModal, setactiveModal] = useState(null);
  const { auth, logoutRole } = useAuth();

  const user = auth.vendor;

  //nav item add Modal
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setloading] = useState(false);
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
  // useEffect(() => {
  // Productsdashboard();
  // }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      if (activeModal === "product") {
        const res = await api.post("/api/product/add", form, {
          headers: {
            "x-role": "Vendor",
          },
        });
        setactiveModal(null);
      }
    } catch (err) {
      // Error adding product
    } finally {
      setloading(false);
    }
  };

  const openModal = () => {
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

  const closeModal = () => {
    setactiveModal(null);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && activeModal) {
        setactiveModal(null);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleEscape);

    // Cleanup event listener
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeModal]); // Only re-run when activeModal changes

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full px-4 md:px-[10%] py-6 gap-6">
        <div className="w-full md:w-1/4 flex flex-col gap-4 sticky top-6 h-fit">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <div className="grid grid-cols-2 items-center">
              <p className="font-medium text-gray-800">
                Hello, {user?.name || "Vendor"}
              </p>
              <a
                href={"/"}
                className="w-full bg-gray-600 text-white text-center rounded-xl shadow-sm px-4 py-2 hover:bg-green-500"
              >
                <b>Home</b>
              </a>
              <p className="text-sm text-gray-500">Manage your store</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-4 no-scrollbar">
            <p className="text-sm font-semibold text-gray-600 mb-3">
              Dashboard
            </p>
            <ul className="space-y-2 text-sm ">
              {[
                "products",
                "Orders",
                "Analytics",
                "customers",
                // "analytics",
                "marketing",
                "settings",
              ].map((item) => (
                <li
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`cursor-pointer capitalize px-3 py-2 rounded-lg ${
                    activeTab === item
                      ? "bg-yellow-200 text-black"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Quick Stats
            </p>
            <p className="text-sm text-gray-500">Products: --</p>
            <p className="text-sm text-gray-500">Sales: --</p>
          </div>

          {/* last btns */}
          <div className="flex justify-around">
            <button
              onClick={() => logoutRole("Vendor")}
              className="w-1/3 bg-gray-600 text-white rounded-xl shadow-sm px-4 py-2 hover:bg-red-500"
            >
              <b>Log Out</b>
            </button>
          </div>
        </div>

        {user?.role === "Vendor" && (
          <div className="col-span-12 md:col-span-8 lg:col-span-9 z-10">
            {activeTab === "products" && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your Products
                  </h2>

                  <button
                    onClick={openModal}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    + Add Product
                  </button>
                </div>

                <Productsdashboard form={form} setForm={setForm} />
              </div>
            )}

            {activeTab === "Orders" && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your Products
                  </h2>

                  <button
                    onClick={openModal}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    + Add Product
                  </button>
                </div>

                <Productsdashboard />
              </div>
            )}

            {activeTab === "Analytics" && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your Products
                  </h2>

                  <button
                    onClick={openModal}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    + Add Product
                  </button>
                </div>

                <Productsdashboard />
              </div>
            )}

            {activeTab === "customers" && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your Products
                  </h2>

                  <button
                    onClick={openModal}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    + Add Product
                  </button>
                </div>

                <Productsdashboard />
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your Products
                  </h2>

                  <button
                    onClick={openModal}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    + Add Product
                  </button>
                </div>

                <Productsdashboard />
              </div>
            )}

            {activeTab === "marketing" && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your Products
                  </h2>

                  <button
                    onClick={openModal}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    + Add Product
                  </button>
                </div>

                <Productsdashboard />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your Products
                  </h2>

                  <button
                    onClick={openModal}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    + Add Product
                  </button>
                </div>

                <Productsdashboard />
              </div>
            )}
          </div>
        )}
      </div>
      <ProductModal
        activeModal={activeModal}
        closeModal={closeModal}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
