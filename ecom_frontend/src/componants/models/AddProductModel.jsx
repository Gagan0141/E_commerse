import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProductModal({
  activeModal,
  closeModal,
  form,
  setForm,
  handleSubmit,
  loading,
}) {
  const [category, setcategory] = useState([]);

  const fetchitems = async () => {
    try {
      const res = await api.get("/api/cat");
      setcategory(res.data);
    } catch (error) {
      // Failed to fetch categories
    }
  };
  useEffect(() => {
    fetchitems();
  }, []);
  if (activeModal !== "product") return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* <div className="W-full bg-white shadow-xl rounded-xl overflow-hidden"> */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Add Product</h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={""}>choose a category</option>
              {category.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              min={0}
              value={form.stock || "0"}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter stock"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              value={form.brand || ""}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter brand"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.discountPercentage || ""}
              onChange={(e) =>
                setForm({ ...form, discountPercentage: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter discount percentage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={form.image || ""}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image URL"
            />
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {loading ? "adding" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
      {/* </div> */}
    </div>
  );
}
