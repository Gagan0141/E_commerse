import React from "react";
// import BottomNavbar from "../navbar/BottomNavbar";
import TopNavbar from "../navbar/TopNavbar";
// import SearchNavbar from "../navbar/SearchNavbar";
import Crousel from "../navbar/Crousel";
import Products from "../models/Products";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F5E6D3] flex flex-col">
      {/* Sticky Navigation */}
      <div className="w-full sticky top-0 z-50 backdrop-blur-md bg-[#1C1917]/95 border-b border-[#5C4635]">
        {/* <SearchNavbar /> */}
        <TopNavbar />
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

            <Products />
          </div>
        </div>
      </main>
    </div>
  );
}
