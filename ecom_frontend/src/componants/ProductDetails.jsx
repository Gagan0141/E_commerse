import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "./api/axios";
import TopNavbar from "./navbar/TopNavbar";
import Review from "./models/Review";
import { useAuth } from "./utils/Auth";

export default function ProductDetails() {
  const { id } = useParams();
  const { auth } = useAuth();

const user =
  auth.admin ||
  auth.vendor;
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      const res = await api.get(`/api/product/${id}`);
      setProduct(res.data);
    } catch (err) {
      // Error fetching product
      setError(err.response?.data?.message || "Failed to load product");
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const requireUser = () => {
    if (user?.role === "User") return true;

    navigate("/login", {
      state: { from: location },
      replace: false,
    });

    return false;
  };

  const addToCart = async () => {
    if (!requireUser()) return;

    try {
      setSaving("cart");
      setError("");
      await api.post("/api/cart/add", {
        productId: product._id,
        role: "User",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setSaving("");
    }
  };

  const addToWishlist = async () => {
    if (!requireUser()) return;

    try {
      setSaving("wishlist");
      setError("");
      await api.post("/api/wishlist/add", {
        productId: product._id,
        role: "User",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setSaving("");
    }
  };

  if (!product)
    return (
      <div className="min-h-screen bg-[#1C1917] flex items-center justify-center text-[#C2A878]">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3]">
      <div className="w-full fixed top-0 z-50 backdrop-blur-md bg-[#1C1917]/95 border-b border-[#5C4635]">
        {/* <SearchNavbar /> */}
        <TopNavbar />
      </div>

      <div className="max-w-7xl mt-12 mx-auto px-4 md:px-8 py-12">
        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="bg-[#2C241F] border border-[#5C4635] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sticky top-24 h-fit">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
          </div>

          {/* Product Info */}
          <div className="sticky top-24 h-fit bg-[#1C1917]">
            {/* Category */}
            {product.category && (
              <p className="uppercase tracking-[0.35em] text-xs text-[#C2A878] mb-3">
                {product.category.title}
              </p>
            )}
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif mb-5 leading-tight">
              {product.title}
            </h1>
            {/* Description */}
            <p className="text-[#C2A878]/80 text-lg leading-relaxed mb-8">
              {product.description}
            </p>
            {/* Price */}
            <div className="mb-8">
              {product.discountPercentage ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-semibold text-[#F5E6D3]">
                    ₹
                    {Math.round(
                      product.price * (1 - product.discountPercentage / 100),
                    )}
                  </span>

                  <span className="line-through text-[#C2A878]/60 text-xl">
                    ₹{product.price}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-[#8B5E3C] text-white text-sm">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-semibold text-[#F5E6D3]">
                  ₹{product.price}
                </span>
              )}
            </div>
            {/* Stock */}
            {product.stock && (
              <p className="text-[#C2A878] mb-8">
                Stock Available: {product.stock}
              </p>
            )}
            {/* Actions */}
            {error && (
              <div className="mb-5 rounded-xl border border-[#A26769]/40 bg-[#A26769]/10 px-4 py-3 text-sm text-[#F5E6D3]">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={addToCart}
                disabled={saving === "cart"}
                className="
                  flex-1
                  px-6 py-4
                  bg-[#8B5E3C]
                  hover:bg-[#734A2E]
                  rounded-xl
                  text-white
                  font-medium
                  transition
                  disabled:opacity-60
                "
              >
                {saving === "cart" ? "Adding..." : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={addToWishlist}
                disabled={saving === "wishlist"}
                className="
                  flex-1
                  px-6 py-4
                  border border-[#5C4635]
                  bg-[#2C241F]
                  hover:bg-[#332922]
                  rounded-xl
                  text-[#F5E6D3]
                  transition
                  disabled:opacity-60
                "
              >
                {saving === "wishlist" ? "Saving..." : "Save to Wishlist"}
              </button>
            </div>
            {/* Details */}
            <div className="mt-12 pt-8 border-t border-[#5C4635]">
              <h2 className="text-2xl font-serif mb-6">Product Details</h2>

              <div className="space-y-3 text-[#C2A878]/80">
                {product.brand && (
                  <p>
                    <span className="text-[#F5E6D3]">Brand:</span>{" "}
                    {product.brand}
                  </p>
                )}

                {product.category && (
                  <p>
                    <span className="text-[#F5E6D3]">Category:</span>{" "}
                    {product.category.title}
                  </p>
                )}

                {product.stock && (
                  <p>
                    <span className="text-[#F5E6D3]">Stock:</span>{" "}
                    {product.stock}
                  </p>
                )}
              </div>
            </div>
            <Review productId={product._id} user={user} />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
