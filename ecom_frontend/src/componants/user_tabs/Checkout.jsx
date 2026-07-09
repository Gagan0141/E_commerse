import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [isGift, setIsGift] = useState(false);

  const [giftInfo, setGiftInfo] = useState({
    fullName: "",
    phone: "",
  });
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me", { headers: { role: "user" } });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart", {
        headers: {
          role: "user",
        },
      });
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
  };

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchUser();
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

  const getAddressForOrder = () => {
    if (!useNewAddress) {
      return savedAddresses.find((a) => a._id === selectedAddressId);
    }

    return {
      street: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    };
  };

  const placeOrder = async () => {
    const address = getAddressForOrder();
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      setOrderError("Please provide a valid shipping address");
      return;
    }

    if (isGift && (!giftInfo.fullName || !giftInfo.phone)) {
      setOrderError("Please enter recipient details");
      return;
    }

    try {
      setPlacingOrder(true);
      await api.post(
        "/api/order/create",
        {
          items: cartItems.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),

          shippingAddress: {
            ...address,
            fullName: isGift ? giftInfo.fullName : user.name,
            phone: isGift ? giftInfo.phone : user.phone,
          },

          totalPrice,

          paymentMethod: "COD",
        },
        { headers: { role: "user" } },
      );
      navigate("/");
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order");
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

                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                  />
                  <span>Send as a gift to someone else</span>
                </label>
                {useNewAddress && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Enter Shipping Details
                    </h3>
                    {isGift && (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <input
                            type="text"
                            name="fullName"
                            value={giftInfo.fullName}
                            onChange={(e) =>
                              setGiftInfo((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                              }))
                            }
                            placeholder="Recipient Name"
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
                            value={giftInfo.phone}
                            onChange={(e) =>
                              setGiftInfo((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="Phone Number"
                            className="
                          bg-[#1C1917]
                          border border-[#5C4635]
                          rounded-xl
                          px-4 py-4
                          outline-none
                          focus:border-[#8B5E3C]
                          md:col-span-2
                          mb-5
                        "
                          />
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
