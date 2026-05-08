import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdCart } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import api from "../api/axios";
import Crousel from "../navbar/Crousel";

export default function Home() {
  const { user, users, logout, refresh } = useAuth();

  const [active, setActive] = useState("For You");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const [count, setCartCount] = useState([]);
  const [navItems, setNavItems] = useState([]);

  const switchRole = (role) => {
    localStorage.setItem("activeRole", role);
    refresh();
    setRoleMenuOpen(false);
  };

  const fetchnavitems = async () => {
    try {
      const response = await api.get("/nav");
      setNavItems(response.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const fetchCartCount = async () => {
    // if (user === "User") {
    const res = await api.get("/cart/count", {
      params: { role: "User" },
    });

    setCartCount(res.data.count);
    // }
  };

  //search
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/product/filter?search=${search}`);
      setProducts(res.data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Products");
    } finally {
      setLoading(false);
    }
  };

  //add to cart
  const addtocart = async (productId) => {
    try {
      const cartitem = { productId };
      await api.post("/cart/add", {
        ...cartitem,
        role: "User",
      }); // console.log("success", res.data);
      // alert("added to cart")
    } catch (error) {
      setError(error.response?.data?.message || "failed to add to cart ");
    }
  };

  //wishlist
  const wishlist = async (productId) => {
    try {
      const wishitem = { productId };
      const res = await api.post("/wishlist/add", {
        ...wishitem,
        role: "User",
      });
      console.log("success", res.data);
      // alert("added to cart")
    } catch (error) {
      setError(error.response?.data?.message || "failed to add to wishlist ");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  //pages function
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const totalPages = Math.ceil(products.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const currentProducts = products.slice(startIndex, endIndex);

  useEffect(() => {
    fetchnavitems();
    fetchCartCount();
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3] flex flex-col">
      {/* Sticky Navigation */}
      <div className="w-full sticky top-0 z-50 backdrop-blur-md bg-[#1C1917]/95 border-b border-[#5C4635]">
        <nav className="w-full sticky top-0 z-50 bg-[#2C241F]/95 backdrop-blur-md border-b border-[#5C4635] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#8B5E3C] border border-[#C2A878] flex items-center justify-center">
                  <FiShoppingBag className="text-[#F5E6D3] text-xl" />
                </div>

                <div>
                  <h1 className="text-[#F5E6D3] font-serif text-2xl">Bazaar</h1>

                  <p className="text-[#C2A878] text-[10px] uppercase tracking-[0.35em]">
                    Heritage Market
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {navItems.map((link) => (
                  <div key={link.title} className="relative group">
                    <Link
                      to={link.path}
                      onClick={() => setActive(link.title)}
                      className="
        relative
        text-[#F5E6D3]
        hover:text-[#C2A878]
        transition-colors duration-300
        font-medium
        pb-2
      "
                    >
                      {link.title}
                    </Link>

                    {/* Hover underline */}
                    <span
                      className="
        absolute
        left-1/2
        -translate-x-1/2
        bottom-0
        h-[2px]
        w-0
        bg-[#C2A878]
        rounded-full
        transition-all
        duration-500
        ease-out
        group-hover:w-full
      "
                    />

                    {/* Active underline */}
                    {active === link.title && (
                      <motion.div
                        layoutId="active-navbar-indicator"
                        className="
          absolute
          left-0
          right-0
          bottom-0
          h-[2px]
          bg-[#8B5E3C]
          rounded-full
        "
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Multi-Role Switcher */}
                {Object.keys(users).length > 1 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                      className="px-3 py-2 rounded-xl border border-[#5C4635] bg-[#1C1917] text-[#C2A878] text-sm font-medium hover:bg-[#332922] transition-colors"
                      title="Switch role"
                    >
                      {user?.role} ⇄
                    </button>

                    {roleMenuOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#2C241F] border border-[#5C4635] rounded-xl shadow-xl">
                        <div className="py-2">
                          {Object.entries(users).map(([role, userData]) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => switchRole(role)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                user?.role === role
                                  ? "bg-[#8B5E3C] text-[#F5E6D3]"
                                  : "text-[#F5E6D3] hover:bg-[#332922]"
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Search */}
                <div className="hidden md:block">
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    className="
                  bg-[#1C1917]
                  border border-[#5C4635]
                  rounded-xl
                  px-4 py-2
                  text-[#F5E6D3]
                  placeholder-[#C2A878]/50
                  outline-none
                  focus:border-[#C2A878]
                "
                    placeholder="Search..."
                  />
                </div>
                {/* Profile */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="p-2 rounded-xl border border-[#5C4635] bg-[#1C1917]"
                  >
                    <CgProfile className="text-[#C2A878] text-xl" />
                    {/* {user.role !== null
                  ? `/${user.role.toLowerCase()}`
                  : ""} */}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#2C241F] border border-[#5C4635] rounded-2xl shadow-xl ">
                      <div className="p-2">
                        {user ? (
                          <>
                            <Link
                              to={`/${user.role.toLowerCase()}`}
                              className="block px-4 py-3 rounded-xl text-[#F5E6D3] hover:bg-[#332922]"
                            >
                              My Profile
                            </Link>
                            {user?.role === "User" && (
                              <>
                                <Link
                                  to={`/cart`}
                                  className="block px-4 py-3 rounded-xl text-[#F5E6D3] hover:bg-[#332922]"
                                >
                                  My Cart
                                </Link>
                                <Link
                                  to={`/wishlist`}
                                  className="block px-4 py-3 rounded-xl text-[#F5E6D3] hover:bg-[#332922]"
                                >
                                  Wishlist
                                </Link>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => logout()}
                              className="w-full text-left px-4 py-3 rounded-xl text-[#A26769] hover:bg-[#332922]"
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/login"
                              className="block px-4 py-3 rounded-xl text-[#F5E6D3] hover:bg-[#332922]"
                            >
                              Login
                            </Link>

                            <Link
                              to="/signup"
                              className="block px-4 py-3 rounded-xl text-[#F5E6D3] hover:bg-[#332922]"
                            >
                              Signup
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Cart */}
                {user?.role === "User" && (
                  <Link
                    to="/cart"
                    className="relative p-2 rounded-xl bg-[#8B5E3C]"
                  >
                    <IoMdCart className="text-white text-xl" />
                    <span className="absolute -top-2 -right-2 bg-[#A26769] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {count}
                    </span>
                  </Link>
                )}
                {/* Mobile Toggle */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 rounded-xl border border-[#5C4635] bg-[#1C1917]"
                >
                  ☰
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="lg:hidden border-t border-[#5C4635] py-4"
              >
                <div className="flex flex-col gap-4">
                  {navItems.map((link) => (
                    <Link
                      key={link.title}
                      to={link.path}
                      className="text-[#F5E6D3] px-2 py-2 hover:text-[#C2A878]"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto rounded-[32px] overflow-hidden border border-[#5C4635] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <Crousel />
        </div>
      </section>

      {/* Bottom Navigation */}
      {/* <div className="w-full border-y border-[#5C4635] bg-[#2C241F]">
        <BottomNavbar />
      </div> */}

      {/* Featured Section */}
      <main className="flex-grow w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-14">
          {/* Section Intro */}
          <div className="mb-12 text-center">
            <p className="uppercase tracking-[0.35em] text-xs text-[#C2A878] mb-4">
              Shop Smart
            </p>

            <h1 className="text-4xl md:text-5xl font-serif mb-4 text-[#F5E6D3]">
              Discover Everything You Need
            </h1>

            <p className="max-w-2xl mx-auto text-[#C2A878]/80 leading-relaxed">
              Explore trending products, daily essentials, exclusive offers, and
              top categories — all in one marketplace.
            </p>
          </div>
          {/* Products Section */}
          <div className="relative">
            {/* Decorative line */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 border-t border-[#C2A878]" />
            <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="mb-10 text-center">
                  <p className="uppercase tracking-[0.35em] text-xs text-[#C2A878] mb-4">
                    Curated Collection
                  </p>

                  <h1 className="text-4xl md:text-5xl font-serif mb-3">
                    Our Products
                  </h1>

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
                          {user?.role === "User" && (
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
          </div>
        </div>
      </main>
    </div>
  );
}
