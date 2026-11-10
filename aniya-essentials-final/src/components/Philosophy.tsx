"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Droplets, Leaf, Truck, Heart, CheckCircle2 } from "lucide-react";
import { BotanicalLeaf } from "./BotanicalElements";

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Smooth header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Story block entrance
      if (storyRef.current) {
        gsap.fromTo(
          storyRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Smooth staggered entrance for the 4 feature badges
      if (cardsRef.current) {
        const badges = cardsRef.current.querySelectorAll(".feature-badge");
        gsap.fromTo(
          badges,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Leaf,
      title: "Pure Botanicals",
      tag: "Rosemary, Fenugreek & Mustard",
    },
    {
      icon: Droplets,
      title: "Scalp Nutrition",
      tag: "Root-to-Tip Nourishment",
    },
    {
      icon: Sparkles,
      title: "Frizz-Free Shine",
      tag: "Smooth & Effortless Finish",
    },
    {
      icon: Truck,
      title: "Nationwide Delivery",
      tag: "Cash on Delivery Available",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#f6f2e9] text-[#203a27] overflow-hidden"
    >
      {/* Subtle Ambient Leaf Accent */}
      <div className="absolute right-4 top-12 w-24 pointer-events-none opacity-15 hidden md:block">
        <BotanicalLeaf variant={2} color="#203a27" />
      </div>
      <div className="absolute left-6 bottom-16 w-20 pointer-events-none opacity-10 hidden lg:block">
        <BotanicalLeaf variant={3} color="#ae5d2e" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#203a27] text-[#f6f2e9] text-[10px] font-mono uppercase tracking-[0.24em] mb-3.5 shadow-sm">
            About Aniya Essentials
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#182b1d] font-normal tracking-tight">
            Beauty Begins with Care
          </h2>
          <div className="w-12 h-0.5 bg-[#ae5d2e] mx-auto mt-4 rounded-full" />
        </div>

        {/* Editorial Story Layout */}
        <div
          ref={storyRef}
          className="bg-[#ffffff] rounded-3xl p-7 sm:p-10 lg:p-12 border border-[#203a27]/10 shadow-[0_10px_35px_rgba(24,43,29,0.05)] mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Brand Badge & Quote */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#203a27]/10 pb-8 lg:pb-0 lg:pr-8">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ae5d2e]/40 shadow-md mb-5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.jpg"
                  alt="Aniya Essentials"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#687751] mb-2">
                Our Core Belief
              </span>

              <blockquote className="font-serif italic text-xl sm:text-2xl text-[#182b1d] leading-snug font-normal">
                &ldquo;Your hair deserves care. Your beauty deserves to shine.&rdquo;
              </blockquote>

              <div className="mt-5 flex items-center gap-2 text-xs text-[#687751]">
                <Heart className="w-3.5 h-3.5 text-[#ae5d2e]" />
                <span className="tracking-wide">Handmade with botanical care</span>
              </div>
            </div>

            {/* Right: Narrative Story Paragraphs */}
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[#35452e] font-light leading-relaxed">
              <p>
                At <strong>Aniya Essentials</strong>, we believe that beautiful hair begins with the right care. Our passion is bringing together nourishing hair oils and thoughtfully selected hair accessories that make every hair care routine a little more special.
              </p>
              <p>
                We understand that every hair journey is unique. That&apos;s why we&apos;re here to help you embrace your natural beauty, care for your hair with confidence, and enjoy the little moments of self-care that make a difference.
              </p>
              <p className="pt-1 text-[#182b1d] font-normal">
                From nourishing your strands to adding the perfect finishing touch, Aniya Essentials is here to make your hair care experience beautiful, simple, and meaningful.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="feature-badge p-5 sm:p-6 rounded-2xl bg-[#ffffff] border border-[#203a27]/10 hover:border-[#ae5d2e]/40 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(32,58,39,0.04)] text-center flex flex-col items-center group cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-[#182b1d] text-[#f6f2e9] flex items-center justify-center mb-3 group-hover:bg-[#ae5d2e] transition-colors duration-300 shadow-sm">
                  <Icon className="w-5 h-5 text-[#f6f2e9]" />
                </div>
                <h3 className="font-serif text-base sm:text-lg text-[#182b1d] font-medium leading-snug">
                  {feat.title}
                </h3>
                <span className="text-[11px] font-mono text-[#687751] mt-1 tracking-wide block">
                  {feat.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
