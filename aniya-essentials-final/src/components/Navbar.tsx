"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { BRAND_CONFIG, getWhatsAppUrl } from "@/config/brand";
import { ShoppingBag, Menu, X, Sparkles, Phone } from "lucide-react";

export default function Navbar() {
  const { totalCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Our Products", href: "#products" },
    { name: "Reviews", href: "#reviews" },
    { name: "About Us", href: "#about" },
    { name: "How to Use", href: "#how-to-use" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#182b1d]/92 backdrop-blur-md py-3.5 border-b border-[#f6f2e9]/10 shadow-lg"
            : "bg-transparent py-5 sm:py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Identity with Official Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5 text-decoration-none focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#ae5d2e]/60 shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.jpg"
                alt="Aniya Essentials Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl tracking-[0.22em] text-[#f6f2e9] font-medium leading-none">
                ANIYA
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#aab79a] uppercase mt-0.5">
                ESSENTIALS
              </span>
            </div>
          </a>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-[0.18em] text-[#f6f2e9]/75 hover:text-[#f6f2e9] transition-colors relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#ae5d2e] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Customer Helpline */}
            <a
              href={`tel:${BRAND_CONFIG.whatsappNumber}`}
              aria-label="Call Helpline"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ae5d2e]/40 text-[#f6f2e9] text-xs tracking-wider uppercase hover:bg-[#ae5d2e]/15 transition-all duration-300"
            >
              <Phone className="w-3.5 h-3.5 text-[#ae5d2e]" />
              <span className="hidden lg:inline text-[11px] font-mono">{BRAND_CONFIG.contactPhone}</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={openCart}
              aria-label="View Shopping Bag"
              className="relative p-2.5 rounded-full bg-[#203a27]/80 hover:bg-[#35452e] border border-[#f6f2e9]/15 text-[#f6f2e9] transition-all duration-300 cursor-pointer flex items-center justify-center group"
            >
              <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ae5d2e] text-[#f6f2e9] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#f6f2e9] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#182b1d]/98 backdrop-blur-xl flex flex-col justify-center px-8 md:hidden animate-fadeIn">
          <nav className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl tracking-[0.12em] text-[#f6f2e9] hover:text-[#ae5d2e] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-6 border-t border-[#f6f2e9]/10 flex flex-col gap-4">
              <a
                href={`tel:${BRAND_CONFIG.whatsappNumber}`}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#ae5d2e] text-[#f6f2e9] text-sm tracking-wider uppercase font-medium"
              >
                <Phone className="w-4 h-4" />
                Helpline: {BRAND_CONFIG.contactPhone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
