"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BottleVisual from "./BottleVisual";
import { useCart } from "@/context/CartContext";
import { BRAND_CONFIG, getWhatsAppUrl } from "@/config/brand";
import { ShoppingBag, MessageCircle, Check } from "lucide-react";

export default function Ritual() {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const { addItem, openCart } = useCart();

  const steps = [
    {
      number: "01",
      id: "growth-potion",
      productName: "Growth Potion Hair Oil",
      headline: "Meet Growth Potion.",
      volume: "200 ml",
      price: 1200,
      priceStr: "PKR 1,200",
      type: "oil" as const,
      imageSrc: "/images/growth-potion.jpg",
      whenToUse: "Pre-wash nourishing massage or overnight treatment",
      quote: "Because good hair starts at the roots.",
      description:
        "A nourishing hair oil by Aniya Essentials, crafted with rosemary, fenugreek, mustard, and cloves to support scalp health, strengthen roots, and encourage healthy hair growth.",
      howToApply:
        "Take a few drops in your palms, gently massage into your scalp in circular motions, and smooth through the lengths to ends. Leave for at least an hour before washing, or let it absorb overnight.",
      tip: "Use 2 to 3 times a week consistently as part of your regular hair-care ritual.",
      themeBg: "#d5ddc9",
      themeText: "#182b1d",
      accent: "#203a27",
    },
    {
      number: "02",
      id: "frizz-guard",
      productName: "Frizz Guard Hair Spray",
      headline: "Meet Frizz Guard.",
      volume: "100 ml",
      price: 300,
      priceStr: "PKR 300",
      type: "spray" as const,
      imageSrc: "/images/frizz-guard.jpg",
      whenToUse: "Daily styling, frizz control & midday freshness",
      quote: "Because smooth hair should feel effortless.",
      description:
        "A lightweight hair spray by Aniya Essentials, made with rosemary extract, and argan oil to smooth frizz, soften hair, and keep it manageable all day.",
      howToApply:
        "Hold the bottle a few inches away and mist lightly over dry or damp hair. Comb through gently with your fingers for a soft, manageable finish without grease or stiffness.",
      tip: "Carry it with you for quick smoothing before work, meetings, or going out.",
      themeBg: "#35452e",
      themeText: "#f6f2e9",
      accent: "#ae5d2e",
    },
  ];

  const current = steps[activeTab];
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: current.id,
      name: current.productName,
      subtitle: current.volume,
      price: current.price,
      size: current.volume,
      type: current.type,
    });
  };

  const handleWhatsApp = () => {
    handleAddToCart();
    openCart();
  };

  return (
    <section
      id="how-to-use"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#203a27] text-[#f6f2e9] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182b1d] border border-[#ae5d2e]/40 mb-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#d5ddc9] font-mono">
              Simple Ritual
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f6f2e9] font-normal tracking-wide">
            How to Use
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#aab79a] font-light max-w-lg mx-auto leading-relaxed">
            Straightforward application for your everyday hair-care routine.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-[#182b1d] border border-[#f6f2e9]/10">
            {steps.map((step, idx) => (
              <button
                key={step.number}
                onClick={() => setActiveTab(idx as 0 | 1)}
                className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === idx
                    ? "bg-[#ae5d2e] text-[#f6f2e9] font-medium shadow-md"
                    : "text-[#aab79a] hover:text-[#f6f2e9]"
                }`}
              >
                <span>{step.productName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border transition-all duration-500"
          style={{
            backgroundColor: current.themeBg,
            color: current.themeText,
            borderColor: "rgba(0,0,0,0.08)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Photo */}
            <div className="md:col-span-5 flex justify-center">
              <div className="transition-transform duration-500 hover:scale-105">
                <BottleVisual
                  type={current.type}
                  size="md"
                  animateGlow={true}
                  imageSrc={current.imageSrc}
                  altText={current.productName}
                />
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-7 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xs font-mono px-3 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: current.accent,
                    color: "#f6f2e9",
                  }}
                >
                  Step {current.number}
                </span>
                <span className="text-xs font-mono font-medium opacity-75">
                  {current.volume} • {current.priceStr}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-snug mt-1 mb-2">
                {current.headline}
              </h3>

              <p className="text-xs font-serif italic text-[#ae5d2e] font-semibold mb-3">
                &ldquo;{current.quote}&rdquo;
              </p>

              <p className="text-xs sm:text-sm leading-relaxed opacity-85 mb-4">
                {current.description}
              </p>

              <div className="space-y-3.5 my-3 pt-3 border-t border-current/15 text-xs sm:text-sm">
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    When to apply
                  </h4>
                  <p className="font-medium">{current.whenToUse}</p>
                </div>

                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    Application
                  </h4>
                  <p className="leading-relaxed opacity-90">{current.howToApply}</p>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Check className="w-4 h-4 text-[#ae5d2e] shrink-0 mt-0.5" />
                  <p className="text-xs italic opacity-85">{current.tip}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-current/15">
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2.5 rounded-full bg-[#203a27] hover:bg-[#182b1d] text-[#f6f2e9] text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#ae5d2e]" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="px-6 py-2.5 rounded-full border border-current hover:bg-black/10 text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
