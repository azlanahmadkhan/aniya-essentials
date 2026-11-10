"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Ritual from "@/components/Ritual";
import ProductCollection from "@/components/ProductCollection";
import ReviewsSection from "@/components/ReviewsSection";
import ClosingCta from "@/components/ClosingCta";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <CartProvider>
      <SmoothScroll>
        <div className="relative min-h-screen bg-[#182b1d] text-[#f6f2e9] selection:bg-[#ae5d2e] selection:text-white">
          {/* Navigation Bar */}
          <Navbar />

          {/* Scene 1: The Unveiling (Hero) */}
          <main>
            <Hero />

            {/* Scene 2: Brand Philosophy & Botanical Matrix */}
            <Philosophy />

            {/* Scene 3: The 3-Step Hair-Care Ritual */}
            <Ritual />

            {/* Scene 4: Curated Product Collection */}
            <ProductCollection />

            {/* Scene 5: Dedicated Customer Reviews & Experience Section */}
            <ReviewsSection />

            {/* Scene 6: Closing Statement & Call to Action */}
            <ClosingCta />
          </main>

          {/* Scene 6: Botanical Editorial Footer */}
          <Footer />

          {/* Interactive Shopping Bag / WhatsApp Order Drawer */}
          <CartDrawer />
        </div>
      </SmoothScroll>
    </CartProvider>
  );
}
