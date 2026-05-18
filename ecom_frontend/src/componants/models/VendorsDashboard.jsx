import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../utils/Auth";

import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaUser,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function VendorsDashboard() {
  const { auth } = useAuth();

  const user = auth.admin || auth.vendor;

  const [vendors, setVendors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    isactive: true,
  });

  const fetchVendors = async () => {
    try {
      setIsLoading(true);

      const res = await api.get("/user/vendors", {
        headers: {
          "x-role": "Admin",
        },
      });

      setVendors(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await api.delete(`/user/${id}`, {
        headers: {
          "x-role": "Admin",
        },
      });

      setVendors((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      // Error deleting vendor
    }
  };

  const handleEdit = (vendor) => {
    setEditId(vendor._id);

    setEditData({
      name: vendor.name || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      isactive: vendor.isactive,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.patch(`/user/${id}`, editData, {
        headers: {
          "x-role": "Admin",
        },
      });
      const updatedVendor = res.data.data || res.data;

      setVendors((prev) => prev.map((v) => (v._id === id ? updatedVendor : v)));

      setEditId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setEditId(null);

    setEditData({
      name: "",
      email: "",
      phone: "",
      isactive: true,
    });
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Vendor Management
          </h1>

          <p className="text-slate-500 mt-2">Manage your vendor database</p>
        </div>

        {/* Empty State */}
        {vendors.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
              <FaStore className="text-3xl text-slate-400" />
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Vendors Found
            </h3>

            <p className="text-slate-500">
              There are currently no vendors in the system.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                      Profile
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                      Vendor
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-5 text-center text-sm font-semibold text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-5 text-center text-sm font-semibold text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-5 text-center text-sm font-semibold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {vendors.map((vendor) => (
                    <tr
                      key={vendor._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      {/* PROFILE */}
                      <td className="px-6 py-5">
                        {vendor.profileImage ? (
                          <img
                            src={vendor.profileImage}
                            alt={vendor.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                            <FaUser className="text-slate-400" />
                          </div>
                        )}
                      </td>

                      {/* NAME */}
                      <td className="px-6 py-5">
                        {editId === vendor._id ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                name: e.target.value,
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaStore className="text-slate-400" />

                            <span className="font-medium text-slate-900">
                              {vendor.name}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-5">
                        {editId === vendor._id ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                email: e.target.value,
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-slate-400" />
                            <span className="text-slate-700">
                              {vendor.email}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* PHONE */}
                      <td className="px-6 py-5">
                        {editId === vendor._id ? (
                          <input
                            type="text"
                            value={editData.phone}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-slate-400" />
                            <span className="text-slate-700">
                              {vendor.phone || "Not Provided"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                          {vendor.role}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5 text-center">
                        {editId === vendor._id ? (
                          <select
                            value={editData.isactive}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                isactive: e.target.value === "true",
                              })
                            }
                            className="border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                          >
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </select>
                        ) : vendor.isactive ? (
                          <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                            <FaCheckCircle />
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-red-500 font-medium">
                            <FaTimesCircle />
                            Inactive
                          </div>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        {editId === vendor._id ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleUpdate(vendor._id)}
                              className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition"
                              title="Save"
                            >
                              <FaSave />
                            </button>

                            <button
                              onClick={handleCancel}
                              className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(vendor)}
                              className="w-10 h-10 rounded-xl bg-slate-900 hover:opacity-90 text-white flex items-center justify-center transition"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() => handleDelete(vendor._id)}
                              className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Count */}
        {vendors.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Showing {vendors.length} vendor
            {vendors.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
