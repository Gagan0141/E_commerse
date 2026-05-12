import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    type: "home",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/address");
      setAddresses(res.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.street || !formData.city || !formData.state || !formData.pincode) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        // Update address
        await api.put(`/address/${editingId}`, formData);
        alert("Address updated successfully");
      } else {
        // Create new address
        await api.post("/api/address", formData);
        alert("Address added successfully");
      }

      setFormData({
        street: "",
        city: "",
        state: "",
        pincode: "",
        type: "home",
        isDefault: false,
      });
      setEditingId(null);
      setShowForm(false);
      await fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      alert(error?.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        setSaving(true);
        await api.delete(`/address/${id}`);
        alert("Address deleted successfully");
        await fetchAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
        alert(error?.response?.data?.message || "Failed to delete address");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setSaving(true);
      await api.patch(`/address/default/${id}`);
      await fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      alert(error?.response?.data?.message || "Failed to set default address");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      street: "",
      city: "",
      state: "",
      pincode: "",
      type: "home",
      isDefault: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          {showForm ? "Cancel" : "+ Add New Address"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Address Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              <label className="ml-2 text-gray-700 text-sm">
                Set as default address
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:bg-gray-400"
              >
                {saving ? "Saving..." : editingId ? "Update Address" : "Add Address"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      <div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <p className="text-gray-500">No addresses saved yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Add your first address to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`bg-white rounded-xl shadow-sm p-5 border-2 transition ${
                  address.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 capitalize">
                        {address.type} Address
                      </h3>
                      {address.isDefault && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{address.street}</p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-lg transition text-sm font-medium"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
