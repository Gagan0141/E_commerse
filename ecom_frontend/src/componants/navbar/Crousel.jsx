import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel() {
  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    fade: true,
    cssEase: "ease-in-out",
  };

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
      title: "Seasonal Fashion Collection",
      subtitle:
        "Discover timeless styles crafted for every season and every moment.",
      cta: "Shop Fashion",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e",
      title: "Fresh Grocery Essentials",
      subtitle:
        "Everyday essentials sourced with quality and freshness in mind.",
      cta: "Shop Grocery",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      title: "Latest Electronics",
      subtitle:
        "Smart technology designed for better living and modern convenience.",
      cta: "Explore Electronics",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      title: "Home & Living",
      subtitle:
        "Curated essentials to make your home warm, elegant, and practical.",
      cta: "View Collection",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      title: "Exclusive Weekly Offers",
      subtitle:
        "Limited-time deals on premium products across every category.",
      cta: "View Offers",
    },
  ];

  return (
    <div className="overflow-hidden rounded-[32px] border border-[#5C4635] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="relative h-[420px] md:h-[450px] lg:h-[550px]">

              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              />

              {/* Vintage Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/95 via-[#2C241F]/70 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex items-center h-full px-8 md:px-14 lg:px-20">
                <div className="max-w-xl">

                  {/* Decorative Line */}
                  {/* <div className="w-20 border-t border-[#C2A878] mb-6" /> */}

                  {/* Title */}
                  <h1 className="text-[#F5E6D3] text-3xl md:text-5xl lg:text-6xl font-serif leading-tight mb-5">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-[#C2A878] text-base md:text-lg leading-relaxed mb-8">
                    {slide.subtitle}
                  </p>

                  {/* CTA */}
                  {slide.cta && (
                    <button
                      className="
                        px-7 py-3
                        bg-[#8B5E3C]
                        hover:bg-[#734A2E]
                        text-white
                        rounded-xl
                        font-medium
                        transition
                      "
                    >
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
  );
}