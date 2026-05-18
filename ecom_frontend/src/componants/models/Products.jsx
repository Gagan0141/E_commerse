import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/Auth";
export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const [products, setProducts] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const { auth } = useAuth();

  const user = auth.admin || auth.vendor;
  const [wishlistItems, setWishlistItems] = useState([]);

  // const [cart, setcart] = useState("");
  const fetchitems = async () => {
    try {
      setloading(true);
      const res = await api.get("/product");
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Products");
    } finally {
      setloading(false);
    }
  };

  const addtocart = async (productId) => {
    try {
      const cartitem = { productId };
      await api.post("/cart/add", cartitem, {
        headers: {
          "x-role": "User",
        },
      }); // console.log("success", res.data);
      // alert("added to cart")
    } catch (error) {
      setError(error.response?.data?.message || "failed to add to cart ");
    }
  };

  const wishlist = async (productId) => {
    try {
      const wishitem = { productId };

      const res = await api.post("/wishlist/add", wishitem, {
        headers: {
          "x-role": "User",
        },
      });

      console.log("success", res.data);

      setWishlistItems(res.data.products);
    } catch (error) {
      setError(error.response?.data?.message || "failed to add to wishlist ");
    }
  };

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setloading(true);

      const res = api.get("/wishlist", {
        headers: {
          "x-role": "User",
        },
      });

      console.log("success", res.data);

      setWishlistItems(res.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setloading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}", {
        headers: {
          "x-role": "User",
        },
      });

      setWishlistItems(res.data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove from wishlist");
    }
  };
  useEffect(() => {
    fetchitems();
    fetchWishlist();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const currentProducts = products.slice(startIndex, endIndex);

  // const imageurl =
  //   "https://raw.githubusercontent.com/Gagan0141/pictures/refs/heads/main/red%20tag.png";
  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="uppercase tracking-[0.35em] text-xs text-[#C2A878] mb-4">
            Curated Collection
          </p>

          <h1 className="text-4xl md:text-5xl font-serif mb-3">Our Products</h1>

          <p className="text-[#C2A878]/80 max-w-xl mx-auto">
            Discover timeless pieces crafted with purpose, quality, and
            heritage.
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

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="text-center py-10 text-[#C2A878]">
            No products found
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((p) => (
            <div
              key={p._id}
              className="relative bg-[#2C241F] border border-[#5C4635] rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.35)] hover:translate-y-[-4px] transition"
            >
              <Link to={`/product/${p._id}`} className="block z-0">
                {/* Discount Badge */}
                {p.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 z-20">
                    <div className="w-14 h-14 rounded-full bg-[#8B5E3C] border-2 border-[#C2A878] flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-white">
                        {p.discountPercentage}% OFF
                      </span>
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                {/* </Link> */}
                {/* Product Info */}

                <div className="p-5">
                  {/* <Link to={`/product/${p._id}`} className="block"> */}
                  {/* Category */}
                  {p.category && (
                    <p className="text-xs uppercase tracking-[0.2em] text-[#C2A878] mb-2">
                      {p.category.title}
                    </p>
                  )}
                  {/* Title */}
                  <h2 className="font-serif text-xl mb-2 hover:text-[#C2A878] transition line-clamp-1">
                    {p.title}
                  </h2>
                  {/* Description */}
                  <p className="text-sm text-[#C2A878]/80 line-clamp-2 mb-4">
                    {p.description}
                  </p>
                  {/* Price */}
                  <div className="mb-4">
                    {p.discountPercentage ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold text-[#F5E6D3]">
                          ₹{" "}
                          {Math.round(
                            p.price * (1 - p.discountPercentage / 100),
                          )}
                        </span>

                        <span className="text-sm line-through text-[#C2A878]/60">
                          ₹ {p.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-semibold text-[#F5E6D3]">
                        ₹ {p.price}
                      </span>
                    )}
                  </div>
                  {/* Stock 
                {p.stock !== undefined && p.stock !== null && (
                  <p className="text-xs text-[#C2A878]/70 mb-4">
                    {(() => {

                      if (p.stock <= 10) {
                      
                        if (p.stock===0)
                           return <span>Out of Stock</span>;
                      
                        else 
                          return <span>Only a Few are left</span>;
                      
                      }

                    })()}
                  </p>
                )}*/}
                  {p.stock !== undefined && p.stock !== null && (
                    <p className="text-xs text-[#C2A878]/70 mb-4">
                      {p.stock <= 10 ? (
                        p.stock === 0 ? (
                          "Out of Stock"
                        ) : (
                          "Only a few are left"
                        )
                      ) : (
                        <span className="text-[#2C241F]">hehehe</span>
                      )}
                    </p>
                  )}
                  {/* </Link> */}
                  {/* Actions */}
                  {activeUser?.role === "User" && (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          addtocart(p._id);
                        }}
                        className="w-full bg-[#8B5E3C] hover:bg-[#734A2E] text-white py-3 rounded-xl font-medium transition z-100"
                      >
                        Add to Cart
                      </button>
                      {(() => {
                        const isWishlisted = wishlistItems.some(
                          (id) => id.toString() === p._id.toString(),
                        );

                        return isWishlisted ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              removeFromWishlist(p._id);
                            }}
                            className="w-full border border-[#5C4635] text-[#C2A878] py-3 rounded-xl font-medium hover:bg-[#5C4635] transition"
                          >
                            Remove from Wishlist
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              wishlist(p._id);
                            }}
                            className="w-full border border-[#5C4635] bg-[#1C1917] hover:bg-[#332922] text-[#F5E6D3] py-3 rounded-xl transition"
                          >
                            Save to Wishlist
                          </button>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {products.length > productsPerPage && (
          <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="
        px-4 py-2 rounded-xl
        border border-[#5C4635]
        bg-[#2C241F]
        text-[#F5E6D3]
        disabled:opacity-40
        hover:bg-[#332922]
        transition
      "
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              // Only show pages within 1 position of current page
              if (index >= currentPage - 2 && index <= currentPage) {
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className="
          px-4 py-2 rounded-xl
          border border-[#5C4635]
          bg-[#2C241F]
          text-[#F5E6D3]
          disabled:opacity-40
          hover:bg-[#332922]
          transition
        "
                  >
                    {index + 1}
                  </button>
                );
              }
              return null;
            })}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="
        px-4 py-2 rounded-xl
        border border-[#5C4635]
        bg-[#2C241F]
        text-[#F5E6D3]
        disabled:opacity-40
        hover:bg-[#332922]
        transition
      "
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
