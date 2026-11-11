"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Phone, Mail, Truck } from "lucide-react";
import { BRAND_CONFIG, getWhatsAppUrl } from "@/config/brand";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#122116] text-[#f6f2e9] pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#f6f2e9]/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#f6f2e9]/10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#ae5d2e]/40 shadow-md shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.jpg"
                  alt="Aniya Essentials Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-[0.2em] text-[#f6f2e9] font-medium leading-none">
                  ANIYA
                </span>
                <span className="text-[10px] tracking-[0.35em] text-[#aab79a] uppercase mt-1">
                  ESSENTIALS
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#aab79a] font-light leading-relaxed max-w-sm mb-6">
              Simple, natural hair care made for your everyday routine.
              Handmade, cruelty-free, and chemical-free in Pakistan.
            </p>

            {/* Newsletter */}
            <div className="max-w-sm">
              <span className="text-xs uppercase tracking-wider text-[#f6f2e9] font-medium block mb-2">
                Updates & Offers
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-[#d5ddc9] p-2.5 rounded-lg bg-[#203a27] border border-[#ae5d2e]/40">
                  <Check className="w-4 h-4 text-[#ae5d2e]" />
                  <span>Thank you for subscribing.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-2 rounded-full bg-[#182b1d] border border-[#f6f2e9]/15 text-xs text-[#f6f2e9] placeholder-[#aab79a]/50 focus:outline-none focus:border-[#ae5d2e]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-[#ae5d2e] hover:bg-[#8e4922] text-[#f6f2e9] text-xs font-medium uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Products Column — ONLY the two actual products */}
          <div>
            <h4 className="font-serif text-sm tracking-wider uppercase text-[#f6f2e9] mb-4">
              Our Products
            </h4>
            <ul className="space-y-3 text-xs text-[#aab79a] font-light">
              <li>
                <a href="#products" className="hover:text-[#f6f2e9] transition-colors block">
                  <span className="text-[#f6f2e9] font-medium">Growth Potion Hair Oil</span>
                  <span className="block text-[11px] text-[#ae5d2e]">200 ml • PKR 1,200</span>
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#f6f2e9] transition-colors block">
                  <span className="text-[#f6f2e9] font-medium">Frizz Guard Hair Spray</span>
                  <span className="block text-[11px] text-[#ae5d2e]">100 ml • PKR 300</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care / Ordering */}
          <div>
            <h4 className="font-serif text-sm tracking-wider uppercase text-[#f6f2e9] mb-4">
              Orders & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-[#aab79a] font-light">
              <li>
                <a
                  href={`tel:${BRAND_CONFIG.whatsappNumber}`}
                  className="hover:text-[#f6f2e9] transition-colors inline-flex items-center gap-1.5 text-[#d5ddc9] font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-[#ae5d2e]" />
                  Helpline: {BRAND_CONFIG.contactPhone}
                </a>
              </li>
              <li>
                <a
                  href="/track"
                  className="hover:text-[#f6f2e9] transition-colors inline-flex items-center gap-1.5 text-[#f6f2e9] font-medium"
                >
                  <Truck className="w-3.5 h-3.5 text-[#ae5d2e]" />
                  Track Parcel (TCS Live Tracking)
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND_CONFIG.ordersEmail}`}
                  className="hover:text-[#f6f2e9] transition-colors inline-flex items-center gap-1.5 text-[#ae5d2e] font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-[#ae5d2e]" />
                  {BRAND_CONFIG.ordersEmail}
                </a>
              </li>
              <li className="pt-1 text-[#aab79a]/80">Cash on Delivery across Pakistan</li>
              <li className="text-[#aab79a]/80">Free delivery on orders over PKR 2,500</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#aab79a]/70 gap-4">
          <p>© {new Date().getFullYear()} Aniya Essentials. All rights reserved.</p>
          <p className="font-mono text-[10px] tracking-wider uppercase">
            Natural Hair Care • Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
