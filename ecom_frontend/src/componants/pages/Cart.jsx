import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/cart", {
        params: { role: "User" },
      }); 
      setCartItems(res.data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart items");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const previousCartItems = cartItems;

    setCartItems((prv) =>
      prv.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );

    try {
      setError("");
      await api.put(`/api/cart/quantity/${itemId}`, {
        quantity: newQuantity,
        role: "User",
      });

      await fetchCartItems();
    } catch (err) {
      setCartItems(previousCartItems);
      setError(err.response?.data?.message || "Failed to update quantity");
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    const previousCartItems = cartItems;

    setCartItems((prv) => prv.filter((item) => item._id !== itemId));

    try {
      setError("");
      await api.delete(`/api/cart/${itemId}`, {
        data: { role: "User" },
      });

      await fetchCartItems();
    } catch (err) {
      setCartItems(previousCartItems);
      setError(err.response?.data?.message || "Failed to remove item");
    }
  };

  // Calculate total price
  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      cartItems.forEach((item) => {
        if (!item.product) return;

        const price = item.product.discountPercentage
          ? item.product.price * (1 - item.product.discountPercentage / 100)
          : item.product.price;
        total += price * item.quantity;
      });
      setTotalPrice(total);
    };

    calculateTotal();
  }, [cartItems]);

  // Initial fetch
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C2A878]"></div>
      </div>
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3] flex items-center justify-center">
        <div className="bg-[#A26769]/10 border border-[#A26769]/30 text-[#F5E6D3] p-6 rounded-xl max-w-md text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchCartItems}
            className="bg-[#8B5E3C] hover:bg-[#734A2E] text-white py-2 px-4 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3] flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-[#C2A878]/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="mb-6 text-[#C2A878]">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/"
            className="inline-block bg-[#8B5E3C] hover:bg-[#734A2E] text-white py-3 px-6 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        {error && (
          <div className="mb-6 bg-[#A26769]/10 border border-[#A26769]/30 text-[#F5E6D3] p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-[#2D2A27] rounded-lg shadow-lg overflow-hidden">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                const discountedPrice = product.discountPercentage
                  ? product.price * (1 - product.discountPercentage / 100)
                  : product.price;
                // console.log(product.title.tostring());

                return (
                  <div
                    key={item._id}
                    className="p-4 border-b border-[#4A453F] last:border-b-0"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full md:w-32 h-32 flex-shrink-0">
                        <img
                          src={product.image || "/placeholder-image.jpg"}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div>
                            <h3 className="font-bold text-lg">
                              {product.title}
                            </h3>
                            <p className="text-[#C2A878] mt-1">
                              {product.category?.title}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="font-bold">
                              ₹ {discountedPrice.toFixed(2)}
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className="ml-2 text-sm line-through text-[#C2A878]">
                                ₹ {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-4">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-[#4A453F] rounded-l-lg hover:bg-[#6B6760]"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-12 h-8 flex items-center justify-center bg-[#3D3934]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-[#4A453F] rounded-r-lg hover:bg-[#6B6760]"
                          >
                            +
                          </button>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="ml-4 text-red-400 hover:text-red-300 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#2D2A27] rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹ {totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹ {(totalPrice * 0.08).toFixed(2)}</span>
                </div>

                <div className="border-t border-[#4A453F] pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹ {(totalPrice * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center bg-[#8B5E3C] hover:bg-[#734A2E] text-white py-3 px-4 rounded-lg transition mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="block text-center text-[#C2A878] hover:text-[#F5E6D3] transition"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Promo Code */}
            <div className="mt-6 bg-[#2D2A27] rounded-lg shadow-lg p-6">
              <h3 className="font-bold mb-3">Promo Code</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-grow bg-[#3D3934] border border-[#4A453F] rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2A878]"
                />
                <button className="bg-[#4A453F] hover:bg-[#6B6760] text-white px-4 py-2 rounded-r-lg transition">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
