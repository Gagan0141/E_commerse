import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [selectedstatus, setSelectedstatus] = useState("pending");

  const statuses = ["pending", "approved", "rejected", "shipped", "delivered"];

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/order/", {
        headers: {
          role: "admin",
        },
      });

      setOrders(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/api/order/status/${id}`,
        { status },
        {
          headers: {
            role: "admin",
          },
        },
      );

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, status } : order)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    }
  };

  const filteredOrders = orders.filter(
    (order) => order.status === selectedstatus,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-[#C2A878] tracking-wide">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Header */}
        <div className="mb-12">
          <p className="uppercase tracking-[0.35em] text-xs text-[#C2A878] mb-4">
            Admin Dashboard
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif mb-3">
                Orders Management
              </h1>

              <p className="text-[#C2A878]/70 max-w-2xl">
                Manage customer purchases, approve pending orders, and monitor
                order activity.
              </p>
            </div>

            <div className="bg-[#2C241F] border border-[#5C4635] rounded-2xl px-6 py-4">
              <p className="text-sm text-[#C2A878] mb-1">Total Orders</p>

              <h2 className="text-3xl font-bold">{orders.length}</h2>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedstatus(status)}
              className={`px-5 py-3 rounded-xl border transition-all capitalize
        ${
          selectedstatus === status
            ? "bg-[#8B5E3C] border-[#8B5E3C] text-white"
            : "bg-[#2C241F] border-[#5C4635] text-[#C2A878] hover:border-[#8B5E3C]"
        }
      `}
            >
              {status}
              <span className="ml-2 text-xs">
                ({orders.filter((o) => o.status === status).length})
              </span>
            </button>
          ))}
        </div>
        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-red-300">
            {error}
          </div>
        )}

        {/* Empty */}
        {!filteredOrders.length ? (
          <div className="bg-[#2C241F] border border-[#5C4635] rounded-3xl p-16 text-center">
            <div className="text-6xl mb-6">📦</div>

            <h2 className="text-3xl font-serif mb-3">No Orders Yet</h2>

            <p className="text-[#C2A878]/70">
              No {selectedstatus} orders found.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="
                bg-[#2C241F]
                border border-[#5C4635]
                rounded-[32px]
                overflow-hidden
                shadow-[0_20px_50px_rgba(0,0,0,0.35)]
              "
              >
                {/* Top */}
                <div className="border-b border-[#5C4635] p-6 lg:p-8">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    {/* Left */}
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#C2A878] mb-3">
                        Order ID
                      </p>

                      <h2 className="font-mono text-sm break-all text-[#F5E6D3]/90">
                        {order._id}
                      </h2>

                      <p className="mt-4 text-sm text-[#C2A878]/70">
                        Ordered on {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div
                        className={`
  px-5 py-3 rounded-2xl text-sm font-semibold uppercase tracking-wide
  ${
    order.status === "pending"
      ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30"
      : order.status === "approved"
        ? "bg-green-500/15 text-green-300 border border-green-500/30"
        : order.status === "rejected"
          ? "bg-red-500/15 text-red-300 border border-red-500/30"
          : order.status === "shipped"
            ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
            : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
  }
`}
                      >
                        {order.status}
                      </div>

                      <div className="bg-[#1C1917] border border-[#5C4635] rounded-2xl px-6 py-4">
                        <p className="text-xs text-[#C2A878] mb-1">
                          Total Amount
                        </p>

                        <h3 className="text-2xl font-bold">
                          ₹ {order.totalPrice?.toFixed(2)}
                        </h3>
                      </div>

                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(order._id, "approved")}
                            className="
                            px-6 py-4 rounded-2xl
                            bg-gradient-to-r
                            from-green-700
                            to-green-600
                            hover:from-green-600
                            hover:to-green-500
                            transition-all duration-300
                            font-medium
                            shadow-lg
                            hover:scale-[1.02]
                            text-green-400
                          "
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => updateStatus(order._id, "rejected")}
                            className="
                          px-6 py-4 rounded-2xl
                          bg-gradient-to-r
                          from-[#8B5E3C]
                          to-[#6F4A2F]
                          hover:scale-[1.02]
                          transition-all duration-300
                          font-medium
                          shadow-lg
                          disabled:opacity-50
                        "
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.status === "approved" && (
                        <button
                          onClick={() => updateStatus(order._id, "shipped")}
                          className="
                          px-6 py-4 rounded-2xl
                          bg-gradient-to-r
                          from-[#8B5E3C]
                          to-[#6F4A2F]
                          hover:scale-[1.02]
                          transition-all duration-300
                          font-medium
                          shadow-lg
                          disabled:opacity-50
                        "
                        >
                          Ship
                        </button>
                      )}

                      {order.status === "shipped" && (
                        <button
                          onClick={() => updateStatus(order._id, "delivered")}
                          className="
                          px-6 py-4 rounded-2xl
                          bg-gradient-to-r
                          from-[#8B5E3C]
                          to-[#6F4A2F]
                          hover:scale-[1.02]
                          transition-all duration-300
                          font-medium
                          shadow-lg
                          disabled:opacity-50
                        "
                        >
                          Deliver
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-6 lg:p-8">
                  {/* Customer */}
                  <div className="bg-[#1C1917] border border-[#5C4635] rounded-3xl p-6 h-fit">
                    <h3 className="text-xl font-serif mb-6 text-[#C2A878]">
                      Customer Details
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#C2A878]/70 mb-1">
                          Name
                        </p>

                        <p className="font-medium">
                          {order.shippingAddress?.fullName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#C2A878]/70 mb-1">
                          Phone
                        </p>

                        <p>{order.shippingAddress?.phone}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#C2A878]/70 mb-1">
                          Address
                        </p>

                        <p className="leading-relaxed text-[#F5E6D3]/90">
                          {order.shippingAddress?.address},{" "}
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state} -{" "}
                          {order.shippingAddress?.pincode}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#C2A878]/70 mb-1">
                          Payment
                        </p>

                        <div className="inline-flex px-4 py-2 rounded-xl bg-[#2C241F] border border-[#5C4635]">
                          {order.paymentMethod}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="xl:col-span-2">
                    <h3 className="text-xl font-serif mb-6 text-[#C2A878]">
                      Ordered Products
                    </h3>

                    <div className="space-y-5">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="
                          bg-[#1C1917]
                          border border-[#5C4635]
                          rounded-3xl
                          p-5
                          hover:border-[#8B5E3C]
                          transition
                        "
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                            <div className="flex items-center gap-5">
                              <img
                                src={item.product?.image}
                                alt={item.product?.title}
                                className="
                                w-24 h-24
                                rounded-2xl
                                object-cover
                                border border-[#5C4635]
                              "
                              />

                              <div>
                                <h4 className="text-lg font-semibold mb-2">
                                  {item.product?.title}
                                </h4>

                                <div className="flex flex-wrap gap-3 text-sm text-[#C2A878]/80">
                                  <span>Qty: {item.quantity}</span>

                                  <span>₹ {item.price.toFixed(2)} each</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-xs uppercase tracking-wide text-[#C2A878]/70 mb-2">
                                Subtotal
                              </p>

                              <h3 className="text-2xl font-bold">
                                ₹ {(item.price * item.quantity).toFixed(2)}
                              </h3>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
