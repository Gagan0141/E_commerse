import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdCart } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import api from "../api/axios";
// import MultiRoleMenu from "./MultiRoleMenu";

export default function TopNavbar() {
  const { logoutRole, auth } = useAuth();

  const user = auth.user;

  const activeUser =
    auth.user || auth.vendor || auth.admin;

  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  // const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const [count, setCartCount] = useState(0);
  const [navItems, setNavItems] = useState([]);

  // const handleSwitchRole = (role) => {
  //   switchRole(role);
  //   setRoleMenuOpen(false);
  // };

  const fetchnavitems = async () => {
    try {
      const response = await api.get("/nav");
      setNavItems(response.data);
    } catch (err) {
      // Failed to fetch nav items
    }
  };

  const fetchCartCount = useCallback(async () => {
    if (activeUser?.role !== "User") {
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get("/cart/count", {
        headers: {
          "x-role": "User",
        },
      });

      setCartCount(res.data.count);
    } catch (error) {
      // Error fetching cart count
    }
  }, [activeUser]);

  useEffect(() => {
    fetchnavitems();
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
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
            {/* {Object.keys(users).length > 1 && (
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
                          onClick={() => handleSwitchRole(role)}
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
            )} */}
            {/* Search */}
            <div className="hidden md:block">
              <input
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
                    {activeUser ? (
                      <>
                        <Link
                          to={`/${activeUser?.role?.toLowerCase() || ""}`}
                          className="block px-4 py-3 rounded-xl text-[#F5E6D3] hover:bg-[#332922]"
                        >
                          My Profile
                        </Link>
                        {activeUser?.role === "User" && (
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
                          onClick={() => logoutRole(activeUser.role)}
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
            {activeUser?.role === "User" && (
              <Link to="/cart" className="relative p-2 rounded-xl bg-[#8B5E3C]">
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
  );
}
