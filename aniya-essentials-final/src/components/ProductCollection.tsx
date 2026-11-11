"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/context/CartContext";
import { BRAND_CONFIG, getWhatsAppUrl } from "@/config/brand";
import { Plus, Minus, ShoppingBag, MessageCircle, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  headline: string;
  price: number; // in PKR
  size: string;
  category: string;
  description: string;
  quote: string;
  type: "oil" | "spray";
  imageSrc: string;
}

export default function ProductCollection() {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Quantities for the two products
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "growth-potion": 1,
    "frizz-guard": 1,
  });

  // Exactly two products with user's exact photos, copy, and prices
  const products: Product[] = [
    {
      id: "growth-potion",
      name: "Growth Potion Hair Oil",
      headline: "Meet Growth Potion.",
      price: 1200,
      size: "200 ml",
      category: "Hair Oil",
      description:
        "A nourishing hair oil by Aniya Essentials, crafted with rosemary, fenugreek, mustard, and cloves to support scalp health, strengthen roots, and encourage healthy hair growth.",
      quote: "Because good hair starts at the roots.",
      type: "oil",
      imageSrc: "/images/growth-potion.jpg",
    },
    {
      id: "frizz-guard",
      name: "Frizz Guard Hair Spray",
      headline: "Meet Frizz Guard.",
      price: 300,
      size: "100 ml",
      category: "Hair Spray",
      description:
        "A lightweight hair spray by Aniya Essentials, made with rosemary extract, and argan oil to smooth frizz, soften hair, and keep it manageable all day.",
      quote: "Because smooth hair should feel effortless.",
      type: "spray",
      imageSrc: "/images/frizz-guard.jpg",
    },
  ];

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addItem(
      {
        id: product.id,
        name: product.name,
        subtitle: product.size,
        price: product.price,
        size: product.size,
        type: product.type,
      },
      qty
    );
  };

  const handleQuickOrder = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addItem(
      {
        id: product.id,
        name: product.name,
        subtitle: product.size,
        price: product.price,
        size: product.size,
        type: product.type,
      },
      qty
    );
    router.push("/checkout");
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".product-card");
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#d5ddc9] text-[#203a27] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#203a27] text-[#f6f2e9] text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
            Aniya Essentials Collection
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#182b1d] font-normal tracking-tight">
            Our Products
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#35452e]/85 max-w-md mx-auto font-light leading-relaxed">
            Two pure botanical essentials created to care for your hair naturally.
          </p>
        </div>

        {/* 2-Column Product Grid — Equal visual balance */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch"
        >
          {products.map((product) => {
            const qty = quantities[product.id] || 1;
            return (
              <div
                key={product.id}
                className="product-card flex flex-col justify-between rounded-3xl bg-[#f6f2e9] border border-[#203a27]/12 p-6 sm:p-8 shadow-[0_12px_35px_rgba(32,58,39,0.08)] hover:shadow-[0_22px_50px_rgba(32,58,39,0.16)] transition-all duration-500 hover:-translate-y-1 group"
              >
                <div>
                  {/* Category & Volume Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#203a27] text-[#f6f2e9]">
                      {product.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#687751]">
                      {product.size}
                    </span>
                  </div>

                  {/* High Quality Product Photo */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#182b1d]/5 border border-[#203a27]/10 mb-6 shadow-sm group-hover:shadow-md transition-all duration-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
                  </div>

                  {/* Product Copy & Editorial Typography */}
                  <div className="mt-2 text-left">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#182b1d] font-normal leading-snug">
                      {product.headline}
                    </h3>
                    <p className="text-sm text-[#35452e]/90 font-light leading-relaxed mt-2.5">
                      {product.description}
                    </p>
                    <p className="text-xs font-serif italic text-[#ae5d2e] font-medium mt-3 mb-4">
                      &ldquo;{product.quote}&rdquo;
                    </p>

                    {/* Clean Review Anchor */}
                    <div className="pt-3 border-t border-[#203a27]/10 flex items-center justify-between text-xs">
                      <a
                        href="#reviews"
                        className="inline-flex items-center gap-1.5 text-[#203a27] hover:text-[#ae5d2e] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center text-[#ae5d2e]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3 h-3 fill-[#ae5d2e] text-[#ae5d2e]" />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono group-hover:underline text-[#35452e]">
                          Reviews Section ↓
                        </span>
                      </a>
                      <a
                        href="#reviews"
                        className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#203a27]/8 hover:bg-[#203a27] hover:text-[#f6f2e9] text-[#203a27] transition-all cursor-pointer"
                      >
                        Leave a Review
                      </a>
                    </div>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-5 border-t border-[#203a27]/10 flex flex-col gap-3.5 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#687751] block">
                        Price
                      </span>
                      <span className="text-2xl font-serif text-[#182b1d] font-semibold">
                        PKR {product.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eee7d9] border border-[#203a27]/15">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="p-1 hover:text-[#ae5d2e] transition-colors"
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-medium px-1.5">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="p-1 hover:text-[#ae5d2e] transition-colors"
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3.5 rounded-full bg-[#203a27] hover:bg-[#182b1d] text-[#f6f2e9] text-xs font-medium uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#ae5d2e]" />
                    Add to Cart
                  </button>

                  {/* Buy Now / Quick Checkout */}
                  <button
                    onClick={() => handleQuickOrder(product)}
                    className="w-full py-3 rounded-full border border-[#ae5d2e] text-[#ae5d2e] hover:bg-[#ae5d2e] hover:text-[#f6f2e9] text-xs font-medium uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
