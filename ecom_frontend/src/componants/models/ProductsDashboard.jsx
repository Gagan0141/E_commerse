import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../utils/Auth";

export default function Productsdashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [category, setcategory] = useState([]);

  const fetchitems = async () => {
    try {
      const res = await api.get("/api/cat");
      setcategory(res.data);
    } catch (error) {
      console.error("failed to fetch data", error);
    }
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
  });

  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/product");
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/product/${id}`, {
        data: {
          role: user.role,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditData({
      title: product.title,
      price: product.price,
      stock: product.stock,
      category: product?.category || "",
    });
  };

  const handleUpdate = async (id) => {
    if (!editData.title || !editData.price || !editData.stock) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const res = await api.patch(`/api/product/${id}`, {
        ...editData,
        role: user.role,
      });

      setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));

      setEditId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Filter first
  const filteredProducts = products.filter(
    (p) =>
      (typeof p.seller === "object" ? p.seller?._id : p.seller) === user?._id ||
      user?.role === "Admin",
  );

  useEffect(() => {
    fetchItems();
    fetchitems();
  }, []);
  // Pagination after filtering
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your product inventory
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <p className="text-slate-500 text-sm">Loading products...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
          <p className="font-medium text-slate-700">No products available</p>
          <p className="text-sm text-slate-400 mt-1">
            Add products to start selling
          </p>
        </div>
      )}

      {/* Products Table */}
      {!loading && filteredProducts.length > 0 && (
        <>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-slate-500">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentProducts.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                          />

                          {editId === p._id ? (
                            <input
                              value={editData.title}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  title: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            />
                          ) : (
                            <span className="font-medium text-slate-900">
                              {p.title}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        {editId === p._id ? (
                          <input
                            value={editData.price}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                price: e.target.value,
                              })
                            }
                            className="w-24 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">
                            ₹{p.price}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        {editId === p._id ? (
                          <input
                            value={editData.stock}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                stock: e.target.value,
                              })
                            }
                            className="w-24 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          />
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                            {p.stock} in stock
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        {editId === p._id ? (
                          <select
                            value={editData.category}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Category</option>
                            {category.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-600">
                            {p.category?.title}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {editId === p._id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(p._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 transition"
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>

                              <button
                                onClick={() => setEditId(null)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200 transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(p)}
                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:opacity-90 transition"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(p._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-medium hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                if (page >= currentPage - 1 && page <= currentPage + 1) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl transition ${
                        currentPage === page
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }

                return null;
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
