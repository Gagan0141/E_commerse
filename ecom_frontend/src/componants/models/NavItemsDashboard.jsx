import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../utils/Auth";

export default function NavItemsDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    categories: [],
  });
  const [categories, setCategories] = useState([]);

  const { auth } = useAuth();

  const user = auth.admin || auth.vendor;

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/nav", {
        headers: {
          "x-role": "Admin",
        },
      });
      setNavItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch nav items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category", {
        headers: {
          "x-role": "Admin",
        },
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/nav/${id}`, {
        headers: {
          "x-role": "Admin",
        },
      });
      setNavItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete nav item");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditData({
      title: item.title,
      categories: item.categories.map((cat) => cat._id),
    });
  };

  const handleUpdate = async (id) => {
    if (!editData.title || editData.categories.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const res = await api.patch(`/nav/${id}`, editData, {
        headers: {
          "x-role": "Admin",
        },
      });
      setNavItems((prev) =>
        prev.map((item) => (item._id === id ? res.data : item)),
      );

      setEditId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update nav item");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const totalPages = Math.ceil(navItems.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = navItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Navigation Items
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your navigation structure
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <p className="text-slate-500 text-sm">Loading navigation items...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && navItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
          <p className="text-slate-600 font-medium">No navigation items yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Create your first navigation item
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && navItems.length > 0 && (
        <>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-slate-500">
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Categories</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      {/* Title */}
                      <td className="px-6 py-4">
                        {editId === item._id ? (
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
                          <span className="font-medium text-slate-800">
                            {item.title}
                          </span>
                        )}
                      </td>
                      {/* categories */}
                      <td className="px-6 py-4">
                        {editId === item._id ? (
                          <div className="space-y-2">
                            {categories.map((category) => (
                              <label
                                key={category._id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={editData.categories.includes(
                                    category._id,
                                  )}
                                  onChange={() => {
                                    const exists = editData.categories.includes(
                                      category._id,
                                    );

                                    if (exists) {
                                      setEditData({
                                        ...editData,
                                        categories: editData.categories.filter(
                                          (id) => id !== category._id,
                                        ),
                                      });
                                    } else {
                                      setEditData({
                                        ...editData,
                                        categories: [
                                          ...editData.categories,
                                          category._id,
                                        ],
                                      });
                                    }
                                  }}
                                />
                                {category.title}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {item.categories?.map((category) => (
                              <span
                                key={category._id}
                                className="px-3 py-1 rounded-full bg-slate-100 text-xs"
                              >
                                {category.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {editId === item._id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(item._id)}
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
                                onClick={() => handleEdit(item)}
                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:opacity-90 transition"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(item._id)}
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
