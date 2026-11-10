"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BRAND_CONFIG, getWhatsAppUrl } from "@/config/brand";
import { BotanicalLeaf } from "./BotanicalElements";

export default function ClosingCta() {
  const { openCart } = useCart();
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (contentRef.current && containerRef.current) {
        gsap.fromTo(
          contentRef.current,
          { scale: 0.95, opacity: 0, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#182b1d] text-[#f6f2e9] overflow-hidden botanical-grain"
    >
      {/* Copper Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#ae5d2e]/15 via-[#35452e]/25 to-[#ae5d2e]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="absolute top-10 left-6 sm:left-16 w-16 pointer-events-none opacity-20">
        <BotanicalLeaf variant={3} color="#aab79a" />
      </div>
      <div className="absolute bottom-10 right-6 sm:right-16 w-20 pointer-events-none opacity-20">
        <BotanicalLeaf variant={2} color="#687751" />
      </div>

      <div
        ref={contentRef}
        className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#203a27] border border-[#ae5d2e]/40 mb-5">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#d5ddc9] font-mono">
            Aniya Essentials
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#f6f2e9] font-normal tracking-tight leading-[1.15] mb-4">
          Simple hair care that fits your day.
        </h2>

        <p className="text-sm sm:text-base text-[#eee7d9]/80 max-w-lg mx-auto leading-relaxed font-light mb-8">
          Order Growth Potion Hair Oil (200 ml) and Frizz Guard Hair Spray (100 ml)
          directly with quick delivery across Pakistan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          <a
            href="#products"
            className="px-8 py-3.5 rounded-full bg-[#ae5d2e] text-[#f6f2e9] text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase hover:bg-[#8e4922] transition-all duration-300 shadow-md inline-flex items-center gap-2"
          >
            Shop Our Products
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={openCart}
            className="px-6 py-3.5 rounded-full bg-[#203a27] border border-[#f6f2e9]/20 text-[#f6f2e9] text-xs sm:text-sm font-light tracking-[0.16em] uppercase hover:bg-[#35452e] transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#ae5d2e]" />
            Order Now
          </button>
        </div>

        {/* 4 Simple Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#f6f2e9]/10 w-full text-center">
          <div>
            <span className="block font-serif text-lg sm:text-xl text-[#ae5d2e] font-semibold">
              200 ml
            </span>
            <span className="text-[11px] text-[#aab79a] mt-0.5 block">
              Growth Potion (PKR 1,200)
            </span>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl text-[#ae5d2e] font-semibold">
              100 ml
            </span>
            <span className="text-[11px] text-[#aab79a] mt-0.5 block">
              Frizz Guard (PKR 300)
            </span>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl text-[#ae5d2e] font-semibold">
              Email Orders
            </span>
            <span className="text-[11px] text-[#aab79a] mt-0.5 block">
              aniyaessentials@gmail.com
            </span>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl text-[#ae5d2e] font-semibold">
              Delivery
            </span>
            <span className="text-[11px] text-[#aab79a] mt-0.5 block">
              All Across Pakistan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
