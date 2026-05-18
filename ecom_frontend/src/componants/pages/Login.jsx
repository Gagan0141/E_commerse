import React, { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../utils/Auth";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "User",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [showpassword, setshowpassword] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (rememberedEmail) {
      setForm((prev) => ({
        ...prev,
        email: rememberedEmail,
      }));

      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.role) {
      setError("All fields are required");

      return;
    }

    try {
      setLoading(true);

      setError("");

      // Send role with login credentials for role-scoped auth
      const res = await login({
        email: form.email,
        password: form.password,
        role: form.role,
      });

      const role = res.user.role;

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", form.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // role-based redirect
      if (role === "Admin") {
        navigate("/admin", {
          replace: true,
        });
      } else if (role === "Vendor") {
        navigate("/vendor", {
          replace: true,
        });
      } else if (role === "User") {
        navigate("/user", {
          replace: true,
        });
      } else {
        navigate(from, {
          replace: true,
        });
      }
    } catch (err) {
      const apiError = err.response?.data;

      const errorMessage =
        apiError?.message || "Login failed. Please try again.";

      setError(errorMessage);

      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate("/signup");
  };

  const toggle = () => {
    setshowpassword(!showpassword);
  };

  // carousel settings
  const settings = {
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    fade: true,
    cssEase: "ease-in-out",
  };

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      title: "Journeys Worth Remembering",
      subtitle:
        "Travel is not merely movement — it is the collection of moments, stories, and timeless memories.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      title: "Flavors of Tradition",
      subtitle:
        "Discover spices and ingredients rooted in heritage, crafted through generations of culinary mastery.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      title: "Captured Through Time",
      subtitle:
        "Preserve moments with precision, clarity, and craftsmanship that endure beyond the present.",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      title: "Spaces with Character",
      subtitle:
        "Curated interiors designed with timeless elegance, warmth, and enduring comfort.",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      title: "The Future, Thoughtfully Made",
      subtitle:
        "Innovation shaped with intention — where technology meets purpose and human experience.",
    },
  ];

  return (
    <div className="relative min-h-screen flex lg:flex-row overflow-hidden bg-[#1C1917]">
      {/* Slider */}
      <div className="absolute inset-0 lg:relative lg:w-3/5 z-0">
        <Slider {...settings} className="h-screen">
          {slides.map((slide) => (
            <div key={slide.id} className="relative h-screen">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/95 via-[#2C241F]/70 to-black/30" />

                <div className="hidden lg:flex relative z-10 h-full items-end px-14 pb-16">
                  <div className="border-l-4 border-[#C2A878] pl-6 max-w-xl">
                    <p className="text-[#F5E6D3] text-4xl font-serif italic leading-relaxed">
                      {slide.title}
                    </p>

                    <p className="text-[#C2A878] text-lg mt-4">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Login Card */}
      <div className="relative z-20 w-full lg:w-2/5 min-h-screen flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleLogin}
            className="bg-[#2C241F]/95 border border-[#5C4635] shadow-2xl rounded-[28px] p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-[#C2A878] uppercase tracking-[0.35em] text-xs mb-4">
                Welcome Back
              </p>

              <h1 className="text-[#F5E6D3] text-5xl font-serif mb-2">Login</h1>

              <p className="text-[#C2A878]/80">
                Continue your timeless journey
              </p>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block mb-2 text-[#C2A878] text-sm">
                Email Address
              </label>

              <input
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                name="email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1917] border border-[#5C4635] text-[#F5E6D3] outline-none focus:border-[#C2A878]"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block mb-2 text-[#C2A878] text-sm">
                Password
              </label>

              <div className="flex items-center px-4 rounded-xl bg-[#1C1917] border border-[#5C4635]">
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  name="password"
                  autoComplete="current-password"
                  type={showpassword ? "text" : "password"}
                  className="w-full py-3 bg-transparent text-[#F5E6D3] outline-none"
                />

                <button
                  onClick={toggle}
                  type="button"
                  className="text-[#C2A878]"
                >
                  {showpassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* ROLE */}
            <div className="mb-6">
              <label className="block mb-2 text-[#C2A878] text-sm">
                Login As
              </label>

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#1C1917] border border-[#5C4635] text-[#F5E6D3] outline-none focus:border-[#C2A878]"
              >
                <option value="User">User</option>

                <option value="Vendor">Vendor</option>

                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Remember */}
            <div className="mb-8 flex justify-between items-center">
              <label className="flex items-center text-sm text-[#C2A878]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember me
              </label>

              <button className="text-sm text-[#A26769] hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-[#A26769]/10 border border-[#A26769]/30 text-[#F5E6D3] text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-4">
              <button
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#8B5E3C] text-white hover:bg-[#734A2E] transition disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={handleClick}
                className="w-full py-3 rounded-xl border border-[#5C4635] text-[#C2A878] hover:bg-[#1C1917]"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
