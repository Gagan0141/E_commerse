import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showpassword, setshowpassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (!form.name || !form.email || !form.password || !form.role) {
        setError("Username, email, role and password are required.");
        return;
      }

      setLoading(true);
      setError("");

      console.log("Signup payload:", form);
      await api.post("/api/auth/signup", form, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      navigate("/login"); // redirect after signup
    } catch (err) {
      console.error("Signup error:", err.response?.data || err);
      const apiError = err.response?.data;
      const message =
        typeof apiError === "string"
          ? apiError
          : apiError?.message || apiError?.error || JSON.stringify(apiError);
      setError(message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  const handleClick = () => {
    navigate("/login");
  };
  const toggle = () => {
    setshowpassword(!showpassword);
  };
  //crousel
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
      cta: "Begin the Journey",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      title: "Flavors of Tradition",
      subtitle:
        "Discover spices and ingredients rooted in heritage, crafted through generations of culinary mastery.",
      cta: "Explore the Collection",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      title: "Captured Through Time",
      subtitle:
        "Preserve moments with precision, clarity, and craftsmanship that endure beyond the present.",
      cta: "View the Craft",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      title: "Spaces with Character",
      subtitle:
        "Curated interiors designed with timeless elegance, warmth, and enduring comfort.",
      cta: "Discover Interiors",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      title: "The Future, Thoughtfully Made",
      subtitle:
        "Innovation shaped with intention — where technology meets purpose and human experience.",
      cta: "Step Forward",
    },
  ];

  return (
    <div className="relative min-h-screen flex lg:flex-row overflow-hidden bg-[#1C1917]">
      {/* Slider Section */}
      <div className="absolute inset-0 lg:relative lg:w-3/5 z-0">
        <Slider {...settings} className="h-screen">
          {slides.map((slide) => (
            <div key={slide.id} className="relative h-screen">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Vintage Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/95 via-[#2C241F]/70 to-black/30" />

                {/* Desktop Content */}
                <div className="hidden lg:flex relative z-10 h-full items-end px-16 pb-16">
                  <div className="max-w-xl">
                    <div className="mb-6 w-20 border-t border-[#C2A878]" />

                    <p className="text-[#F5E6D3] text-4xl font-serif italic leading-relaxed mb-5">
                      {slide.title}
                    </p>

                    <p className="text-[#C2A878] text-lg leading-relaxed mb-6">
                      {slide.subtitle}
                    </p>

                    {slide.cta && (
                      <button className="px-6 py-3 border border-[#C2A878] text-[#F5E6D3] rounded-xl hover:bg-[#C2A878]/10 transition">
                        {slide.cta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Signup Section */}
      <div className="relative z-20 w-full lg:w-2/5 min-h-screen flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <form className="bg-[#2C241F]/95 border border-[#5C4635] shadow-[0_25px_60px_rgba(0,0,0,0.45)] rounded-[30px] p-8 md:p-10">
            {/* Brand */}
            <div className="mb-10 text-center">
              {/* <div className="w-16 h-16 mx-auto rounded-full border border-[#C2A878] flex items-center justify-center text-[#C2A878] text-2xl font-serif mb-4">
                B
              </div>

              <p className="uppercase tracking-[0.35em] text-xs text-[#C2A878] mb-4">
                Join The Collection
              </p> */}

              <h2 className="text-5xl font-serif text-[#F5E6D3] mb-2">
                Create Account
              </h2>

              <p className="text-[#C2A878]/80 text-sm">
                Begin your timeless journey with us
              </p>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label className="text-sm text-[#C2A878] mb-2 block">
                Full Name
              </label>

              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#5C4635] bg-[#1C1917] text-[#F5E6D3] outline-none focus:border-[#C2A878] transition"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="text-sm text-[#C2A878] mb-2 block">
                Email Address
              </label>

              <input
                type="email"
                value={form.email}
                // autoComplete="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#5C4635] bg-[#1C1917] text-[#F5E6D3] outline-none focus:border-[#C2A878] transition"
                placeholder="john@example.com"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="text-sm text-[#C2A878] mb-2 block">
                Password
              </label>
              <div className="flex items-center px-4 rounded-xl bg-[#1C1917] border border-[#5C4635]">
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  type={showpassword ? "text" : "password"}
                  className="w-full py-3 bg-transparent text-[#F5E6D3] outline-none"
                  placeholder="••••••••"
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

            {/* Role */}
            <div className="mb-6">
              <label className="text-sm text-[#C2A878] mb-2 block">
                Account Type
              </label>

              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#5C4635] bg-[#1C1917] text-[#F5E6D3] outline-none focus:border-[#C2A878] transition"
              >
                <option>Choose role</option>
                <option>User</option>
                <option>Vendor</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-[#A26769]/30 bg-[#A26769]/10 p-3 text-sm text-[#F5E6D3]">
                {error}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-[#8B5E3C] hover:bg-[#734A2E] text-white py-3 rounded-xl font-medium transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-[#5C4635]" />
              <span className="px-4 text-xs tracking-[0.25em] text-[#C2A878]">
                OR
              </span>
              <div className="flex-1 border-t border-[#5C4635]" />
            </div>

            {/* Alternative Auth */}
            <button
              type="button"
              className="w-full border border-[#5C4635] bg-[#1C1917] text-[#F5E6D3] py-3 rounded-xl hover:bg-[#332922] transition"
            >
              Continue with Google
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-[#C2A878]/80 mt-6">
              Already have an account?
              <button
                type="button"
                onClick={handleClick}
                className="ml-2 text-[#A26769] hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
