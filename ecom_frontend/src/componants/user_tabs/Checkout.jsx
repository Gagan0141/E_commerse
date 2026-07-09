import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  useEffect(() => {
    let total = 0;

    cartItems.forEach((item) => {
      const price = item.product.discountPercentage
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price;

      total += price * item.quantity;
    });

    setTotalPrice(total);
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart", {
        headers: {
          role: "user",
        },
      });

      setCartItems(res.data.items || []);
    } catch (error) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/api/address", {
        headers: {
          role: "user",
        },
      });
      setSavedAddresses(res.data || []);

      // Auto-select default address if available
      const defaultAddress = res.data?.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setUseNewAddress(false);
      }
    } catch (error) {
      // Error fetching addresses - handled
    }
  };

  const getAddressForOrder = () => {
    if (!useNewAddress && selectedAddressId) {
      const selected = savedAddresses.find(
        (addr) => addr._id === selectedAddressId,
      );
      if (selected) {
        return {
          address: selected.street,
          city: selected.city,
          state: selected.state,
          pincode: selected.pincode,
          type: selected.type,
          fullName: selected.fullName || form.fullName,
          phone: selected.phone || form.phone,
        };
      }
    }
    return form;
  };

  const placeOrder = async () => {
    try {
      setOrderError("");

      const shippingAddress = getAddressForOrder();

      if (
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.pincode
      ) {
        setOrderError("Please provide valid shipping address");
        return;
      }

      if (useNewAddress) {
        if (!form.fullName || !form.phone) {
          setOrderError("Please enter name and phone");
          return;
        }
      }

      setPlacingOrder(true);

      await api.post(
        "/api/order/create",
        {
          items: cartItems.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),

          shippingAddress: {
            ...shippingAddress,
            fullName: form.fullName || "Customer",
            phone: form.phone || "",
          },

          totalPrice,

          paymentMethod: "COD",
        },
        {
          headers: {
            role: "user",
          },
        },
      );

      alert("Order placed successfully");

      navigate("/");
    } catch (error) {
      setOrderError(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleChange = (e) => {
    setForm((prv) => ({
      ...prv,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex items-center justify-center text-[#F5E6D3]">
        Loading...
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex flex-col items-center justify-center text-[#F5E6D3]">
        <h2 className="text-2xl mb-4">No items in cart</h2>

        <Link to="/" className="px-6 py-3 bg-[#8B5E3C] rounded-xl">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-serif mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#2C241F] border border-[#5C4635] rounded-3xl p-8 mb-6">
              <h2 className="text-2xl font-serif mb-6">
                Select Delivery Address
              </h2>

              {orderError && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-xl text-red-300">
                  {orderError}
                </div>
              )}

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Saved Addresses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {savedAddresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => handleSelectAddress(address._id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                          selectedAddressId === address._id && !useNewAddress
                            ? "border-[#C2A878] bg-[#3C2D22] shadow-[0_0_0_1px_#C2A878]"
                            : "border-[#5C4635] hover:border-[#8B5E3C]"
                        }`}
                      >
                        <p className="font-semibold capitalize">
                          {address.type}
                        </p>
                        <p className="text-sm mt-2">{address.street}</p>
                        <p className="text-sm">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        {address.isDefault && (
                          <span className="text-xs bg-[#8B5E3C] px-2 py-1 rounded mt-2 inline-block">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Use New Address Option */}
              <div className="border-t border-[#5C4635] pt-6">
                <button
                  onClick={() => setUseNewAddress(!useNewAddress)}
                  className={`w-full p-3 border-2 rounded-xl mb-6 transition ${
                    useNewAddress
                      ? "border-[#8B5E3C] bg-[#3C2D22]"
                      : "border-[#5C4635] hover:border-[#8B5E3C]"
                  }`}
                >
                  {useNewAddress ? "✓ Use New Address" : "Use New Address"}
                </button>

                {useNewAddress && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Enter Shipping Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="
                          bg-[#1C1917]
                          border border-[#5C4635]
                          rounded-xl
                          px-4 py-4
                          outline-none
                          focus:border-[#8B5E3C]
                          md:col-span-2
                        "
                      />
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="
                          bg-[#1C1917]
                          border border-[#5C4635]
                          rounded-xl
                          px-4 py-4
                          outline-none
                          focus:border-[#8B5E3C]
                          md:col-span-2
                        "
                      />
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Street Address"
                        className="
                          bg-[#1C1917]
                          border border-[#5C4635]
                          rounded-xl
                          px-4 py-4
                          outline-none
                          focus:border-[#8B5E3C]
                          md:col-span-2
                        "
                      />
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="
                          bg-[#1C1917]
                          border border-[#5C4635]
                          rounded-xl
                          px-4 py-4
                          outline-none
                          focus:border-[#8B5E3C]
                        "
                      />
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="
                          bg-[#1C1917]
                          border border-[#5C4635]
                          rounded-xl
                          px-4 py-4
                          outline-none
                          focus:border-[#8B5E3C]
                        "
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="
                          bg-[#1C1917]
                          border border-[#5C4635]
                          rounded-xl
                          px-4 py-4
                          outline-none
                          focus:border-[#8B5E3C]
                        "
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#2C241F] border border-[#5C4635] rounded-3xl p-6 sticky top-6">
              <h2 className="text-2xl font-serif mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const price = item.product.discountPercentage
                    ? item.product.price *
                      (1 - item.product.discountPercentage / 100)
                    : item.product.price;

                  return (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm border-b border-[#5C4635] pb-3"
                    >
                      <span>
                        {item.product.title} × {item.quantity}
                      </span>

                      <span>₹ {(price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 border-t border-[#5C4635] pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹ {totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹ {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className="
                  w-full mt-6
                  px-6 py-4
                  bg-[#8B5E3C]
                  hover:bg-[#734A2E]
                  rounded-xl
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {placingOrder ? "Placing Order..." : "Place Order"}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//                   <span>Total</span>
//                   <span>₹ {totalPrice.toFixed(2)}</span>
//                 </div>
//               </div>

//               <button
//                 onClick={initiatePayment}
//                 disabled={placingOrder}
//                 className="
//                   w-full mt-6
//                   px-6 py-4
//                   bg-[#8B5E3C]
//                   hover:bg-[#734A2E]
//                   rounded-xl
//                   transition
//                   disabled:opacity-50
//                   disabled:cursor-not-allowed
//                 "
//               >
//                 {placingOrder ? "Processing..." : "Proceed to Payment"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
