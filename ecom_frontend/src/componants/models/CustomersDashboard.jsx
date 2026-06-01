import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../utils/Auth";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function CustomersDashboard() {
  const { auth } = useAuth();

  const user = auth.admin || auth.vendor;

  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    isactive: true,
  });

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);

      const res = await api.get("/api/user/customers", {
        headers: {
          "x-role": "Admin",
        },
      });

      setCustomers(res.data);
    } catch (err) {
      // Error fetching customers
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      await api.delete(`/api/user/${id}`, {
        headers: {
          "x-role": "Admin",
        },
      });

      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      // Error deleting customer
    }
  };

  const handleEdit = (customer) => {
    setEditId(customer._id);

    setEditData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      isactive: customer.isactive,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.patch(`/api/user/${id}`, editData, {
        headers: {
          "x-role": "Admin",
        },
      });
      const updatedCustomer = res.data.data || res.data;

      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? updatedCustomer : c)),
      );

      setEditId(null);
    } catch (err) {
      // Error updating customer
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
    fetchCustomers();
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
            Customer Management
          </h1>

          <p className="text-slate-500 mt-2">Manage your customer database</p>
        </div>

        {/* Empty State */}
        {customers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
              <FaUser className="text-3xl text-slate-400" />
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No Customers Found
            </h2>

            <p className="text-slate-500">
              There are currently no customers in the system.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-5 px-6 text-left text-sm font-semibold text-slate-500">
                      Profile
                    </th>

                    <th className="py-5 px-6 text-left text-sm font-semibold text-slate-500">
                      Name
                    </th>

                    <th className="py-5 px-6 text-left text-sm font-semibold text-slate-500">
                      Email
                    </th>

                    <th className="py-5 px-6 text-left text-sm font-semibold text-slate-500">
                      Phone
                    </th>

                    <th className="py-5 px-6 text-center text-sm font-semibold text-slate-500">
                      Role
                    </th>

                    <th className="py-5 px-6 text-center text-sm font-semibold text-slate-500">
                      Status
                    </th>

                    <th className="py-5 px-6 text-center text-sm font-semibold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      {/* PROFILE */}
                      <td className="py-5 px-6">
                        {customer.profileImage ? (
                          <img
                            src={customer.profileImage}
                            alt={customer.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                            <FaUser className="text-slate-400" />
                          </div>
                        )}
                      </td>

                      {/* NAME */}
                      <td className="py-5 px-6">
                        {editId === customer._id ? (
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
                            <FaUser className="text-slate-400" />
                            <span className="font-medium text-slate-900">
                              {customer.name}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* EMAIL */}
                      <td className="py-5 px-6">
                        {editId === customer._id ? (
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
                              {customer.email}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* PHONE */}
                      <td className="py-5 px-6">
                        {editId === customer._id ? (
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
                              {customer.phone || "Not Provided"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* ROLE */}
                      <td className="py-5 px-6 text-center">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                          {customer.role}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="py-5 px-6 text-center">
                        {editId === customer._id ? (
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
                        ) : customer.isactive ? (
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
                      <td className="py-5 px-6 text-center">
                        {editId === customer._id ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleUpdate(customer._id)}
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
                              onClick={() => handleEdit(customer)}
                              className="w-10 h-10 rounded-xl bg-slate-900 hover:opacity-90 text-white flex items-center justify-center transition"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() => handleDelete(customer._id)}
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
        {customers.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Showing {customers.length} customer
            {customers.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
