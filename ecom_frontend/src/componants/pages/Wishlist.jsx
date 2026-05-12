import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/wishlist", {
        params: {
          role: "User",
        },
      });
      setWishlistItems(res.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items for checking availability
  const fetchCartItems = async () => {
    try {
      const res = await api.get("/api/cart");
      setCartItems(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`, {
        data: { role: "User" },
      });
      setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  // Add to cart from wishlist
  const addToCart = async (productId) => {
    try {
      await api.post("/api/cart/add", {
        productId,
        role: "User",
      });
      // Remove from wishlist after adding to cart
      removeFromWishlist(productId);
      fetchCartItems(); // Refresh cart items
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
    }
  };

  useEffect(() => {
    fetchWishlist();
    fetchCartItems();
  }, []);

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some(
      (item) => item.productId?._id?.toString() === productId.toString(),
    );
  };

  // Check if product is available
  const isAvailable = (product) => {
    return (
      product.stock !== undefined && product.stock !== null && product.stock > 0
    );
  };

  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="uppercase tracking-[0.35em] text-xs text-[#C2A878] mb-4">
            Your Favorites
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-3">Wishlist</h1>
          <p className="text-[#C2A878]/80 max-w-xl mx-auto">
            Items you've saved for later
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C2A878]" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-[#A26769]/10 border border-[#A26769]/30 text-[#F5E6D3] p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Empty Wishlist */}
        {!loading && wishlistItems.length === 0 && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">💔</div>
            <h2 className="text-2xl font-serif mb-2">Your wishlist is empty</h2>
            <p className="text-[#C2A878]/80 mb-6">
              Start adding items you like to your wishlist
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#8B5E3C] hover:bg-[#734A2E] text-white py-3 px-6 rounded-xl font-medium transition"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Wishlist Items */}
        {!loading && wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product) => {
              //   const product = products.productId;
              return (
                <div
                  key={product._id}
                  className="relative bg-[#2C241F] border border-[#5C4635] rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.35)] hover:translate-y-[-4px] transition"
                >
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Category */}
                    {product.category && (
                      <p className="text-xs uppercase tracking-[0.2em] text-[#C2A878] mb-2">
                        {product.category.title}
                      </p>
                    )}

                    {/* Title */}
                    <h2 className="font-serif text-xl mb-2 hover:text-[#C2A878] transition line-clamp-1">
                      {product.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-[#C2A878]/80 line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      {product.discountPercentage ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-semibold text-[#F5E6D3]">
                            ₹{" "}
                            {Math.round(
                              product.price *
                                (1 - product.discountPercentage / 100),
                            )}
                          </span>

                          <span className="text-sm line-through text-[#C2A878]/60">
                            ₹ {product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-semibold text-[#F5E6D3]">
                          ₹ {product.price}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock !== undefined && product.stock !== null && (
                      <p className="text-xs text-[#C2A878]/70 mb-4">
                        {isAvailable(product) ? (
                          <span className="text-green-500">In Stock</span>
                        ) : (
                          <span className="text-red-500">Out of Stock</span>
                        )}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                      {isAvailable(product) && !isInCart(product._id) ? (
                        <button
                          onClick={() => addToCart(product._id)}
                          className="w-full bg-[#8B5E3C] hover:bg-[#734A2E] text-white py-3 rounded-xl font-medium transition"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-[#332922] text-[#C2A878]/50 py-3 rounded-xl font-medium cursor-not-allowed"
                        >
                          {isInCart(product._id)
                            ? "Added to Cart"
                            : "Out of Stock"}
                        </button>
                      )}

                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="w-full border border-[#5C4635] text-[#C2A878] py-3 rounded-xl font-medium hover:bg-[#5C4635] transition"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
