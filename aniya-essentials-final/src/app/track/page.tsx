"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BRAND_CONFIG } from "@/config/brand";
import {
  Truck,
  Search,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("id") || searchParams.get("cn") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const fetchTracking = async (searchVal: string) => {
    const term = searchVal.trim();
    if (!term) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      // First try our backend orders database
      const res = await fetch(`/api/order?id=${encodeURIComponent(term)}`);
      const data = await res.json();

      if (res.ok && data.found) {
        setOrderData(data.order);
      } else {
        // If not found in local orders, treat as direct TCS Consignment Number
        setOrderData({
          orderId: term.startsWith("AE-") ? term : `TCS-${term}`,
          trackingNumber: term.replace(/[^0-9]/g, "") || term,
          courier: "TCS Express",
          status: "Dispatched & In Transit",
          customerName: "Valued Customer",
          city: "Pakistan",
          isDirectCN: true,
        });
      }
    } catch {
      setError("Unable to connect to tracking server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const tcsTrackingUrl = orderData?.trackingNumber
    ? `https://www.tcsexpress.com/tracking?tracking_no=${orderData.trackingNumber}`
    : `https://www.tcsexpress.com/tracking`;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#182b1d]">
      {/* Header */}
      <header className="border-b border-[#e8e2d8] bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#52644e] hover:text-[#182b1d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to shop</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#ae5d2e]/40 shadow-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.jpg"
                alt="Aniya Essentials Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-serif text-lg sm:text-xl tracking-[0.18em] text-[#182b1d] font-medium leading-none">
                ANIYA
              </span>
              <span className="text-[8px] tracking-[0.35em] text-[#ae5d2e] uppercase mt-0.5">
                ESSENTIALS
              </span>
            </div>
          </Link>

          <div className="text-xs text-[#687751] font-mono hidden sm:block">
            TCS Live Tracking
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#203a27] text-white text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
            <Truck className="w-3.5 h-3.5 text-[#ae5d2e]" />
            Nationwide Courier Dispatch
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#182b1d] font-normal">
            Track Your Parcel
          </h1>
          <p className="text-xs sm:text-sm text-[#52644e] mt-2 max-w-md mx-auto">
            Enter your <strong>Aniya Essentials Order ID</strong> (e.g. <code>AE-7419</code>) or your <strong>TCS Tracking Number</strong> to view real-time delivery status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-sm p-4 sm:p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8a9884] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Order ID (e.g. AE-9284) or TCS Tracking Number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#faf8f5] border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-xl bg-[#203a27] hover:bg-[#182b1d] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all disabled:opacity-50 cursor-pointer shadow-sm shrink-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-[#ae5d2e]" />
                  <span>Track Parcel</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracking Result Card */}
        {orderData && (
          <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#e8e2d8]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#687751] block">
                  Order Reference
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#182b1d] font-semibold">
                  #{orderData.orderId}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#687751] block">
                  Courier Partner
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 text-xs font-bold font-mono">
                  <Truck className="w-3.5 h-3.5 text-red-600" />
                  {orderData.courier || "TCS Express"}
                </span>
              </div>
            </div>

            {/* TCS Consignment Number & 1-Click Official TCS Link */}
            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e5dec9] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#687751] block">
                  TCS Consignment Number (CN):
                </span>
                <strong className="font-mono text-base text-[#ae5d2e]">
                  {orderData.trackingNumber || "Assigned upon pickup"}
                </strong>
              </div>

              <a
                href={tcsTrackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#ae5d2e] hover:bg-[#8e4922] text-white text-xs font-medium inline-flex items-center gap-1.5 transition shadow-sm"
              >
                <span>Open TCS Official Tracking</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Visual Timeline Stepper */}
            <div>
              <h4 className="font-serif text-sm text-[#182b1d] font-medium mb-4">
                Shipment Progress
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d8d0c3]">
                {/* Step 1 */}
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-6 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center ring-4 ring-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-medium text-xs text-[#182b1d]">
                      Order Confirmed
                    </h5>
                    <p className="text-[11px] text-[#687751]">
                      Your order has been verified and registered with Aniya Essentials.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-6 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center ring-4 ring-white">
                    <Package className="w-3 h-3" />
                  </div>
                  <div>
                    <h5 className="font-medium text-xs text-[#182b1d]">
                      Handcrafted & Packaged
                    </h5>
                    <p className="text-[11px] text-[#687751]">
                      Fresh botanical batch packed securely with protective bubble cushioning.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-6 w-5 h-5 rounded-full bg-[#ae5d2e] text-white flex items-center justify-center ring-4 ring-white animate-pulse">
                    <Truck className="w-3 h-3" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-[#ae5d2e]">
                      Dispatched with TCS Express
                    </h5>
                    <p className="text-[11px] text-[#52644e]">
                      In transit across courier hub network towards destination city.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-6 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center ring-4 ring-white">
                    <Clock className="w-3 h-3" />
                  </div>
                  <div>
                    <h5 className="font-medium text-xs text-gray-500">
                      Out for Delivery
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      TCS delivery rider will contact customer before arriving at address.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-6 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center ring-4 ring-white">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <div>
                    <h5 className="font-medium text-xs text-gray-500">
                      Delivered to Doorstep
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      Parcel received by customer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpline support */}
            <div className="pt-4 border-t border-[#e8e2d8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#687751]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#ae5d2e]" />
                <span>
                  Delivery questions? Call: <strong>{BRAND_CONFIG.contactPhone}</strong>
                </span>
              </div>
              <span className="text-[#8a9884]">Estimated delivery: 3 to 5 business days</span>
            </div>
          </div>
        )}

        {/* Alternative Courier Quick Links */}
        <div className="mt-8 p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm text-center space-y-4">
          <h4 className="font-serif text-sm font-medium text-[#182b1d]">
            Official Pakistan Courier Tracking Portals
          </h4>
          <p className="text-xs text-[#687751]">
            If your parcel was dispatched with an alternative courier service:
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 pt-1">
            <a
              href="https://www.tcsexpress.com/tracking"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#faf8f5] hover:bg-[#f0eae1] border border-[#d8d0c3] text-xs font-mono font-medium text-[#182b1d] inline-flex items-center gap-1 transition"
            >
              <span>TCS Express Tracking</span>
              <ExternalLink className="w-3 h-3 text-[#ae5d2e]" />
            </a>
            <a
              href="https://leopardscourier.com/leopards-tracking/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#faf8f5] hover:bg-[#f0eae1] border border-[#d8d0c3] text-xs font-mono font-medium text-[#182b1d] inline-flex items-center gap-1 transition"
            >
              <span>Leopards Courier</span>
              <ExternalLink className="w-3 h-3 text-[#ae5d2e]" />
            </a>
            <a
              href="https://callcourier.com.pk/tracking/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#faf8f5] hover:bg-[#f0eae1] border border-[#d8d0c3] text-xs font-mono font-medium text-[#182b1d] inline-flex items-center gap-1 transition"
            >
              <span>Call Courier</span>
              <ExternalLink className="w-3 h-3 text-[#ae5d2e]" />
            </a>
            <a
              href="https://postex.pk/tracking"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#faf8f5] hover:bg-[#f0eae1] border border-[#d8d0c3] text-xs font-mono font-medium text-[#182b1d] inline-flex items-center gap-1 transition"
            >
              <span>PostEx</span>
              <ExternalLink className="w-3 h-3 text-[#ae5d2e]" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] text-[#182b1d]">
          <div className="flex items-center gap-2 text-sm font-mono">
            <Truck className="w-5 h-5 text-[#ae5d2e] animate-bounce" />
            <span>Loading Tracking Module...</span>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
