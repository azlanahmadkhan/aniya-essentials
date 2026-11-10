"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BottleVisual from "./BottleVisual";
import { BotanicalLeaf } from "./BotanicalElements";
import { useCart } from "@/context/CartContext";
import { BRAND_CONFIG, getWhatsAppUrl } from "@/config/brand";
import { ShoppingBag } from "lucide-react";

export default function Hero() {
  const { openCart, addItem } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const copperLineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const leaf1Ref = useRef<HTMLDivElement>(null);
  const leaf2Ref = useRef<HTMLDivElement>(null);
  const leaf3Ref = useRef<HTMLDivElement>(null);
  const leaf4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Initial Load Master Timeline with Silky Smooth Easing
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.15,
      });

      // Copper line drawing outward
      tl.fromTo(
        copperLineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7, ease: "power2.inOut" }
      );

      // "ANIYA" headline reveal
      tl.fromTo(
        titleRef.current,
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.4"
      );

      // "ESSENTIALS" spaced subtitle
      tl.fromTo(
        subtitleRef.current,
        { letterSpacing: "0.2em", opacity: 0, y: 10 },
        { letterSpacing: "0.45em", opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
      );

      // Hero Product Bottle Gentle Elevation
      tl.fromTo(
        bottleRef.current,
        { y: 60, scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" },
        "-=0.6"
      );

      // Headline and CTA buttons fade in
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );

      // Ambient Botanical floating leaves entrance
      tl.fromTo(
        [leaf1Ref.current, leaf2Ref.current, leaf3Ref.current, leaf4Ref.current],
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 0.5,
          scale: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.1,
          ease: "sine.out",
        },
        "-=0.6"
      );

      // 2. Continuous Organic Idle Floating Animation for the Bottle (Silky Smooth Breathing Effect)
      if (bottleRef.current) {
        gsap.to(bottleRef.current, {
          y: -10,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Idle floating for leaves
      gsap.to(leaf1Ref.current, {
        y: "+=12",
        rotation: "+=4",
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(leaf2Ref.current, {
        y: "-=14",
        rotation: "-=5",
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.4,
      });

      // 3. Luxurious Multi-Layer Parallax with GSAP & Lenis Smooth Scrolling
      if (containerRef.current) {
        if (bottleRef.current) {
          gsap.to(bottleRef.current, {
            y: -40,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }

        if (leaf1Ref.current) {
          gsap.to(leaf1Ref.current, {
            y: -70,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.6,
            },
          });
        }

        if (leaf2Ref.current) {
          gsap.to(leaf2Ref.current, {
            y: -95,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.8,
            },
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] h-auto flex flex-col items-center justify-between pt-20 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-6 overflow-hidden bg-[#182b1d] botanical-grain"
    >
      {/* Radial Atmosphere Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[400px] bg-gradient-to-b from-[#ae5d2e]/15 via-[#203a27]/30 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#182b1d] to-transparent pointer-events-none z-10" />

      {/* Floating Botanical Leaves */}
      <div
        ref={leaf1Ref}
        className="absolute top-1/4 left-4 sm:left-12 lg:left-24 w-16 sm:w-22 pointer-events-none z-0"
      >
        <BotanicalLeaf variant={1} color="#687751" opacity={0.3} />
      </div>

      <div
        ref={leaf2Ref}
        className="absolute top-1/3 right-4 sm:right-12 lg:right-28 w-18 sm:w-24 pointer-events-none z-0"
      >
        <BotanicalLeaf variant={2} color="#aab79a" opacity={0.25} />
      </div>

      <div
        ref={leaf3Ref}
        className="absolute bottom-1/4 left-8 sm:left-24 w-14 sm:w-18 pointer-events-none z-0 hidden sm:block"
      >
        <BotanicalLeaf variant={3} color="#35452e" opacity={0.35} />
      </div>

      <div
        ref={leaf4Ref}
        className="absolute top-2/3 right-8 sm:right-20 w-14 sm:w-20 pointer-events-none z-0 hidden sm:block"
      >
        <BotanicalLeaf variant={1} color="#687751" opacity={0.2} />
      </div>

      {/* Brand Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto w-full shrink-0">
        <div className="overflow-hidden">
          <h1
            ref={titleRef}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.14em] text-[#f6f2e9] font-normal leading-[0.95]"
          >
            ANIYA
          </h1>
        </div>

        {/* Copper Dividing Line */}
        <div
          ref={copperLineRef}
          className="w-20 sm:w-32 h-[1.5px] bg-gradient-to-r from-transparent via-[#ae5d2e] to-transparent my-2 sm:my-2.5"
        />

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="text-[10px] sm:text-xs md:text-sm uppercase text-[#aab79a] font-light tracking-[0.45em]"
        >
          ESSENTIALS
        </div>
      </div>

      {/* Main Focus: Growth Potion Hair Oil Illustrated Bottle */}
      <div
        ref={bottleRef}
        className="relative z-20 my-2 sm:my-3 flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-[1.03] shrink-0"
      >
        <BottleVisual
          type="oil"
          size="hero"
          animateGlow={true}
          forceIllustration={true}
        />
      </div>

      {/* Bottom Content: Clean, Polished, Minimal */}
      <div
        ref={taglineRef}
        className="relative z-20 flex flex-col items-center text-center max-w-xl mx-auto shrink-0 w-full"
      >
        <h2 className="font-serif italic text-lg sm:text-2xl md:text-3xl text-[#eee7d9] font-light mb-3 sm:mb-4">
          &ldquo;Care for your hair, naturally.&rdquo;
        </h2>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#products"
            className="px-7 sm:px-9 py-2.5 sm:py-3 rounded-full bg-[#ae5d2e] hover:bg-[#8e4922] text-[#f6f2e9] text-xs sm:text-sm font-medium tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(174,93,46,0.35)] hover:shadow-[0_15px_30px_rgba(174,93,46,0.5)] cursor-pointer"
          >
            Shop Our Products
          </a>
          <button
            onClick={() => {
              addItem({
                id: "growth-potion",
                name: "Growth Potion Hair Oil",
                subtitle: "200 ml",
                price: 1200,
                size: "200 ml",
                type: "oil",
              });
              openCart();
            }}
            className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#203a27]/90 border border-[#f6f2e9]/25 text-[#f6f2e9] text-xs sm:text-sm font-light tracking-[0.16em] uppercase hover:bg-[#2e4c34] transition-all duration-300 inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#ae5d2e]" />
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
}
