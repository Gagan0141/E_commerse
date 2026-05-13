import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/orders/my");

      setOrders(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "delivered":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            My Orders
          </h2>

          <p className="text-gray-500 mt-1">
            Track and manage your orders
          </p>
        </div>

        <Link
          to="/"
          className="
            bg-blue-600 hover:bg-blue-700
            text-white px-5 py-3
            rounded-xl transition
            shadow-sm
          "
        >
          Continue Shopping
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Orders */}
      <div>
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center border border-gray-100">
            <p className="text-gray-500">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Orders Yet
            </h3>

            <p className="text-gray-500 mb-6">
              Your orders will appear here
            </p>

            <Link
              to="/"
              className="
                inline-block
                bg-blue-600 hover:bg-blue-700
                text-white px-6 py-3
                rounded-xl transition
              "
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="
                  bg-white
                  rounded-2xl
                  shadow-sm
                  border border-gray-100
                  overflow-hidden
                "
              >
                {/* Top */}
                <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Order ID
                    </p>

                    <h3 className="font-mono text-sm text-gray-700 break-all">
                      {order._id}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium
                        ${getStatusStyles(order.status)}
                      `}
                    >
                      {order.status}
                    </span>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <h3 className="text-lg font-bold text-gray-800">
                        ₹{" "}
                        {order.totalPrice?.toFixed(
                          2,
                        )}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="p-5">
                  <h4 className="font-semibold text-gray-700 mb-4">
                    Ordered Items
                  </h4>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="
                          flex flex-col md:flex-row
                          md:items-center
                          justify-between
                          gap-4
                          bg-gray-50
                          rounded-xl
                          p-4
                        "
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              item.product?.image
                            }
                            alt={
                              item.product?.title
                            }
                            className="
                              w-20 h-20
                              rounded-xl
                              object-cover
                              border border-gray-200
                            "
                          />

                          <div>
                            <h5 className="font-semibold text-gray-800">
                              {
                                item.product
                                  ?.title
                              }
                            </h5>

                            <p className="text-sm text-gray-500 mt-1">
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                            <p className="text-sm text-gray-500">
                              ₹{" "}
                              {item.price.toFixed(
                                2,
                              )}{" "}
                              each
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Subtotal
                          </p>

                          <h4 className="font-bold text-gray-800">
                            ₹{" "}
                            {(
                              item.price *
                              item.quantity
                            ).toFixed(2)}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping */}
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Shipping Address
                  </h4>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {
                        order.shippingAddress
                          ?.fullName
                      }
                    </p>

                    <p>
                      {
                        order.shippingAddress
                          ?.phone
                      }
                    </p>

                    <p>
                      {
                        order.shippingAddress
                          ?.address
                      }
                      ,{" "}
                      {
                        order.shippingAddress
                          ?.city
                      }
                      ,{" "}
                      {
                        order.shippingAddress
                          ?.state
                      }{" "}
                      -{" "}
                      {
                        order.shippingAddress
                          ?.pincode
                      }
                    </p>
                  </div>

                  <div className="mt-4 text-xs text-gray-400">
                    Ordered on{" "}
                    {new Date(
                      order.createdAt,
                    ).toLocaleString()}
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