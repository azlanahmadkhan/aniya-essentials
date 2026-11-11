"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getLenis } from "./SmoothScroll";
import { BRAND_CONFIG } from "@/config/brand";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalCount,
    subtotal,
  } = useCart();

  // Lock Lenis smooth scroll while cart drawer is open
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      if (isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [isOpen]);

  const shipping =
    subtotal >= BRAND_CONFIG.freeShippingThreshold || subtotal === 0
      ? 0
      : BRAND_CONFIG.standardShippingFee;
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Sliding Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#182b1d] border-l border-[#f6f2e9]/10 shadow-2xl flex flex-col text-[#f6f2e9]">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[#f6f2e9]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#ae5d2e]" />
              <h2 className="font-serif text-lg tracking-wider text-[#f6f2e9]">
                Your Shopping Bag
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#203a27] text-[#aab79a]">
                {totalCount}
              </span>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-[#203a27] text-[#aab79a] hover:text-[#f6f2e9] transition-colors cursor-pointer"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#203a27] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#aab79a]/60" />
                </div>
                <h3 className="font-serif text-lg text-[#f6f2e9]">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#aab79a] mt-1.5 max-w-xs font-light">
                  Explore our pure botanical essentials and care for your hair naturally.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#ae5d2e] hover:bg-[#8e4922] text-[#f6f2e9] text-xs font-medium uppercase tracking-[0.14em] transition-all cursor-pointer shadow-sm"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#203a27]/60 border border-[#f6f2e9]/10 flex items-center gap-3.5"
                  >
                    {/* Product Photo */}
                    <div className="w-16 h-16 rounded-xl bg-[#142318] border border-[#f6f2e9]/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.type === "oil"
                            ? "/images/growth-potion.jpg"
                            : "/images/frizz-guard.jpg"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-[#f6f2e9] truncate font-medium">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#aab79a] font-light">
                        {item.size}
                      </p>
                      <p className="text-xs font-mono font-semibold text-[#ae5d2e] mt-1">
                        PKR {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-[#aab79a]/60 hover:text-red-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#142318] border border-[#f6f2e9]/15">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-0.5 hover:text-[#ae5d2e] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-medium px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-0.5 hover:text-[#ae5d2e] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#f6f2e9]/10 bg-[#142318]">
              <div className="space-y-1.5 text-xs text-[#aab79a] mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#f6f2e9]">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({BRAND_CONFIG.location})</span>
                  <span className="font-mono text-[#f6f2e9]">
                    {shipping === 0 ? "FREE" : `PKR ${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-[#f6f2e9] pt-2 border-t border-[#f6f2e9]/10">
                  <span className="font-serif">Total Payable</span>
                  <span className="font-mono text-lg text-[#ae5d2e] font-semibold">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* High-End Proceed to Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full h-12 rounded-full bg-[#ae5d2e] hover:bg-[#8e4922] active:scale-[0.99] text-[#f6f2e9] text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#f6f2e9]" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="flex items-center justify-center gap-2.5 pt-3 text-[10px] text-[#aab79a]/80 font-light">
                <ShieldCheck className="w-3 h-3 text-[#ae5d2e]" />
                <span>Secure Checkout • Cash on Delivery / Mobile Account</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
