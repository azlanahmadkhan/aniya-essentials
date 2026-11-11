"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { BRAND_CONFIG } from "@/config/brand";
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Lock,
  ArrowLeft,
  Building2,
  Wallet,
  Copy,
  Check,
  Camera,
  X,
  ExternalLink,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Collapsible summary state (mobile)
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Form Fields
  const [contact, setContact] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("Lahore");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "easypaisa_jazzcash" | "bank_deposit"
  >("cod");
  const [paymentReference, setPaymentReference] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  // Copy indicator
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Billing address
  const [billingSame, setBillingSame] = useState(true);

  // Discount
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  // Policy Modal
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shipping calculation
  const shippingFee =
    subtotal >= BRAND_CONFIG.freeShippingThreshold || subtotal === 0
      ? 0
      : BRAND_CONFIG.standardShippingFee;

  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setReceiptImage(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError("");
    const code = discountCode.trim().toUpperCase();
    if (code === "ANIYA10" || code === "CARE10" || code === "WELCOME") {
      setDiscountApplied(true);
    } else {
      setDiscountError("Invalid coupon code. Try 'ANIYA10'");
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Your shopping bag is empty. Please add a product first.");
      return;
    }

    if (!contact.trim()) {
      setErrorMessage("Please enter your email or mobile phone number.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Please enter your full first and last name.");
      return;
    }
    if (!address.trim()) {
      setErrorMessage("Please enter your delivery street address.");
      return;
    }
    if (!city.trim()) {
      setErrorMessage("Please enter your delivery city.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please enter your contact phone number for TCS courier.");
      return;
    }

    // Require transaction verification details for bank or mobile account
    if (paymentMethod === "bank_deposit" && !paymentReference.trim() && !senderName.trim()) {
      setErrorMessage(
        "Please provide your Bank Transaction ID or Sender Account Name so we can verify your UBL payment."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${firstName.trim()} ${lastName.trim()}`,
          customerPhone: phone.trim(),
          customerEmail: contact.includes("@") ? contact.trim() : "",
          customerAddress: address.trim(),
          apartment: apartment.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          paymentMethod,
          paymentReference: paymentReference.trim(),
          senderName: senderName.trim(),
          receiptImage: receiptImage || "",
          items,
          subtotal,
          shipping: shippingFee,
          total,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrderConfirmed({
          orderId: data.orderId,
          trackingNumber: data.trackingNumber,
          courier: data.courier || "TCS Express",
          name: `${firstName.trim()} ${lastName.trim()}`,
          phone: phone.trim(),
          address: `${address.trim()}${apartment ? `, ${apartment.trim()}` : ""}, ${city.trim()}`,
          paymentMethod: data.paymentMethod,
          paymentReference: paymentReference.trim(),
          total,
          items: [...items],
        });
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(data.error || "Failed to place order. Please try again.");
      }
    } catch {
      setErrorMessage("Network error. Please check your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ORDER CONFIRMED RECEIPT SCREEN
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#1c2c1e] py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#e8e2d8] shadow-sm p-6 sm:p-10">
          {/* Header */}
          <div className="text-center pb-6 border-b border-[#e8e2d8]">
            <div className="w-16 h-16 rounded-full bg-[#203a27] text-white mx-auto flex items-center justify-center mb-4 shadow">
              <CheckCircle2 className="w-10 h-10 text-[#ae5d2e]" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#ae5d2e] font-semibold">
              Order Confirmed
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#182b1d] mt-1 font-normal">
              Thank you, {orderConfirmed.name}!
            </h1>
            <p className="text-sm text-[#4a5d48] mt-2">
              Your order <span className="font-mono font-semibold text-[#182b1d]">#{orderConfirmed.orderId}</span> has been confirmed.
            </p>
          </div>

          {/* TCS Courier & Tracking Notice */}
          <div className="my-6 p-4 rounded-xl bg-[#f4f7f2] border border-[#dce6d7] space-y-2.5">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#203a27] shrink-0 mt-0.5" />
              <div className="text-xs text-[#203a27] leading-relaxed flex-1">
                <span className="font-semibold block text-sm mb-0.5">
                  TCS Express Courier Dispatch (3 to 5 Business Days)
                </span>
                Your parcel will be dispatched via TCS Express to your address in <strong>{orderConfirmed.address}</strong>.
              </div>
            </div>

            <div className="pt-2 border-t border-[#dce6d7] flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[#687751]">
                TCS Tracking CN: <strong className="font-mono text-[#182b1d]">{orderConfirmed.trackingNumber}</strong>
              </span>
              <Link
                href={`/track?id=${orderConfirmed.orderId}`}
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#ae5d2e] hover:underline"
              >
                <span>Track Live Status</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="space-y-3.5 text-xs py-4 border-t border-b border-[#e8e2d8]">
            <div className="flex justify-between">
              <span className="text-[#687751]">Delivery Address:</span>
              <span className="font-medium text-right max-w-xs text-[#182b1d]">
                {orderConfirmed.address}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687751]">Payment Method:</span>
              <span className="font-medium text-[#182b1d]">
                {orderConfirmed.paymentMethod}
                {orderConfirmed.paymentReference && ` (Ref: ${orderConfirmed.paymentReference})`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687751]">Contact Phone:</span>
              <span className="font-mono font-medium text-[#182b1d]">
                {orderConfirmed.phone}
              </span>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="my-6">
            <h3 className="font-serif text-sm uppercase tracking-wider text-[#182b1d] mb-3">
              Items in this shipment
            </h3>
            <div className="space-y-3">
              {orderConfirmed.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-2 border-b border-[#f0eae1]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#182b1d]/5 border border-[#e5dec9] overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.type === "oil" ? "/images/growth-potion.jpg" : "/images/frizz-guard.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-[#182b1d] block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#687751]">
                        Qty: {item.quantity} • {item.size}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-medium text-[#182b1d]">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between text-sm font-semibold text-[#182b1d]">
              <span>Total Payable</span>
              <span className="font-mono text-[#ae5d2e] text-base">
                PKR {orderConfirmed.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/track?id=${orderConfirmed.orderId}`}
                className="px-6 py-3 rounded-full bg-[#ae5d2e] hover:bg-[#8e4922] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-sm inline-flex items-center justify-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Parcel Location</span>
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-full bg-[#203a27] hover:bg-[#182b1d] text-white text-xs font-medium uppercase tracking-[0.14em] transition-all shadow-sm"
              >
                Continue Shopping
              </Link>
            </div>
            <p className="text-[11px] text-[#687751] pt-2">
              For any questions, reach our customer care at{" "}
              <strong className="text-[#182b1d] font-mono">{BRAND_CONFIG.contactPhone}</strong> or{" "}
              <strong className="text-[#ae5d2e]">{BRAND_CONFIG.ordersEmail}</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c2c1e]">
      {/* Top Checkout Header */}
      <header className="border-b border-[#e8e2d8] bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#52644e] hover:text-[#182b1d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to shop</span>
          </Link>

          {/* Brand Logo with Icon */}
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

          <Link href="/" className="relative p-1.5 text-[#203a27]">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ae5d2e] text-white text-[10px] font-mono flex items-center justify-center font-bold">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Collapsible Order Summary Bar */}
      <div className="lg:hidden border-b border-[#e8e2d8] bg-[#f5f2ec]">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-medium text-[#182b1d]"
        >
          <div className="flex items-center gap-2 text-[#ae5d2e]">
            <ShoppingBag className="w-4 h-4" />
            <span>{summaryOpen ? "Hide order summary" : "Show order summary"}</span>
            {summaryOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          <span className="font-mono text-sm font-semibold">
            Rs {total.toLocaleString()}
          </span>
        </button>

        {summaryOpen && (
          <div className="px-4 pb-5 pt-2 border-t border-[#e8e2d8]/60 space-y-4 animate-in fade-in">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-white border border-[#e5dec9] overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.type === "oil" ? "/images/growth-potion.jpg" : "/images/frizz-guard.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#203a27] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#182b1d]">{item.name}</p>
                      <p className="text-[11px] text-[#687751]">{item.size}</p>
                    </div>
                  </div>
                  <span className="font-mono font-medium">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e8e2d8] space-y-1.5 text-xs text-[#52644e]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#182b1d]">Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (TCS Express)</span>
                <span className="font-mono text-[#182b1d]">
                  {shippingFee === 0 ? "FREE" : `Rs ${shippingFee}`}
                </span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-[#ae5d2e]">
                  <span>Discount</span>
                  <span className="font-mono">-Rs {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-[#182b1d] pt-2 border-t border-[#e8e2d8]">
                <span>Total</span>
                <span className="font-mono text-[#ae5d2e] text-base">
                  Rs {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Checkout Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Checkout Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleCompleteOrder} className="space-y-8">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* 1. Contact Section */}
              <div>
                <h2 className="text-base sm:text-lg font-serif font-medium text-[#182b1d] mb-2">
                  Contact
                </h2>
                <input
                  type="text"
                  required
                  placeholder="Email or mobile phone number *"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27] focus:ring-1 focus:ring-[#203a27]"
                />
              </div>

              {/* 2. Delivery Address */}
              <div>
                <h2 className="text-base sm:text-lg font-serif font-medium text-[#182b1d] mb-3">
                  Delivery
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#687751] mb-1">
                      Country / Region
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#f0eae1]/60 border border-[#d8d0c3] text-sm text-[#182b1d] font-medium flex items-center justify-between">
                      <span>Pakistan</span>
                      <span className="text-xs text-[#687751]">🇵🇰 Nationwide</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="First name *"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27] focus:ring-1 focus:ring-[#203a27]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Last name *"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27] focus:ring-1 focus:ring-[#203a27]"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Address (House #, Street, Area) *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27] focus:ring-1 focus:ring-[#203a27]"
                  />

                  <input
                    type="text"
                    placeholder="Apartment, suite, unit (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27] focus:ring-1 focus:ring-[#203a27]"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City (e.g. Lahore, Karachi, Islamabad) *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27] focus:ring-1 focus:ring-[#203a27]"
                    />
                    <input
                      type="text"
                      placeholder="Postal code (optional)"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27] focus:ring-1 focus:ring-[#203a27]"
                    />
                  </div>

                  <input
                    type="tel"
                    required
                    placeholder="Phone for courier updates (e.g. 0313 1234567) *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#d8d0c3] text-sm text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27] focus:ring-1 focus:ring-[#203a27]"
                  />
                </div>
              </div>

              {/* 3. Shipping Method (TCS Express) */}
              <div>
                <h2 className="text-base sm:text-lg font-serif font-medium text-[#182b1d] mb-3">
                  Shipping method
                </h2>
                <div className="rounded-lg border border-[#203a27] bg-[#f4f7f2] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-[#203a27] bg-white flex items-center justify-center shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#182b1d]">
                        TCS Express Delivery (Trackable)
                      </p>
                      <p className="text-xs text-[#52644e]">
                        3 to 5 business days with TCS Live Tracking
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#182b1d]">
                    {shippingFee === 0 ? "FREE" : `Rs ${shippingFee}`}
                  </span>
                </div>
              </div>

              {/* 4. Payment Section with UBL Bank & Mobile Wallets */}
              <div>
                <div className="mb-1">
                  <h2 className="text-base sm:text-lg font-serif font-medium text-[#182b1d]">
                    Payment
                  </h2>
                  <p className="text-xs text-[#687751]">
                    All transactions are secure and encrypted.
                  </p>
                </div>

                <div className="mt-3 rounded-lg border border-[#d8d0c3] bg-white divide-y divide-[#e8e2d8] overflow-hidden">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <label className="p-4 flex items-start gap-3 cursor-pointer hover:bg-[#faf8f5] transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 text-[#203a27] focus:ring-[#203a27]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#182b1d]">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] font-mono uppercase bg-[#203a27]/10 text-[#203a27] px-2 py-0.5 rounded font-medium">
                          Pay at Doorstep
                        </span>
                      </div>
                      {paymentMethod === "cod" && (
                        <p className="text-xs text-[#52644e] mt-1.5 animate-in fade-in">
                          Pay cash to the TCS delivery courier when your package arrives at your home.
                        </p>
                      )}
                    </div>
                  </label>

                  {/* Option 2: UBL Bank Deposit (Direct Official Bank Account) */}
                  <label className="p-4 flex items-start gap-3 cursor-pointer hover:bg-[#faf8f5] transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_deposit"
                      checked={paymentMethod === "bank_deposit"}
                      onChange={() => setPaymentMethod("bank_deposit")}
                      className="mt-1 text-[#203a27] focus:ring-[#203a27]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#182b1d]">
                            Direct Bank Deposit (UBL Bank)
                          </span>
                          <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">
                            UBL
                          </span>
                        </div>
                        <Building2 className="w-4 h-4 text-[#687751]" />
                      </div>

                      {paymentMethod === "bank_deposit" && (
                        <div className="mt-3.5 p-4 rounded-xl bg-[#faf8f5] border border-[#e5dec9] text-xs space-y-3 animate-in fade-in">
                          <div className="p-3 bg-white rounded-lg border border-[#e8e2d8] space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[#687751]">Bank Name:</span>
                              <strong className="text-[#182b1d]">United Bank Limited (UBL Bank)</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#687751]">Account Title:</span>
                              <div className="flex items-center gap-1.5">
                                <strong className="text-[#182b1d]">Azlan Ahmad Khan</strong>
                                <button
                                  type="button"
                                  onClick={() => handleCopy("Azlan Ahmad Khan", "title")}
                                  className="text-[#ae5d2e] hover:text-[#182b1d] p-0.5"
                                  title="Copy Title"
                                >
                                  {copiedField === "title" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-[#f0eae1]">
                              <span className="text-[#687751]">IBAN Number:</span>
                              <div className="flex items-center gap-1.5">
                                <strong className="font-mono text-[#ae5d2e] font-semibold text-xs sm:text-sm">
                                  PK80UNIL0109000311421826
                                </strong>
                                <button
                                  type="button"
                                  onClick={() => handleCopy("PK80UNIL0109000311421826", "iban")}
                                  className="text-[#ae5d2e] hover:text-[#182b1d] p-0.5"
                                  title="Copy IBAN"
                                >
                                  {copiedField === "iban" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-[#52644e] leading-relaxed">
                            Transfer <strong>Rs {total.toLocaleString()}</strong> to the UBL account above via your banking app (Meezan, HBL, Bank Alfalah, Sadapay, Nayapay, etc.).
                          </div>

                          {/* Verification inputs so the merchant immediately knows who paid */}
                          <div className="space-y-2 pt-1">
                            <div>
                              <label className="block text-[11px] font-mono text-[#182b1d] font-medium mb-1">
                                Transaction ID / TID (from bank app receipt) *
                              </label>
                              <input
                                type="text"
                                required={paymentMethod === "bank_deposit"}
                                placeholder="e.g. 1234567890"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-white border border-[#d8d0c3] text-xs text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-mono text-[#182b1d] font-medium mb-1">
                                Sender Name / Bank Name (e.g. Ali Raza - Meezan Bank)
                              </label>
                              <input
                                type="text"
                                placeholder="Your name on the bank account"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-white border border-[#d8d0c3] text-xs text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27]"
                              />
                            </div>

                            {/* Screenshot Upload */}
                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleReceiptUpload}
                                className="hidden"
                              />
                              {receiptImage ? (
                                <div className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200">
                                  <div className="flex items-center gap-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={receiptImage}
                                      alt="Receipt preview"
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                    <span className="text-green-800 font-medium">Receipt attached ✓</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setReceiptImage(null)}
                                    className="p-1 text-gray-500 hover:text-red-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full py-2 px-3 rounded border border-dashed border-[#d8d0c3] bg-white text-[11px] text-[#52644e] hover:border-[#ae5d2e] flex items-center justify-center gap-1.5 transition cursor-pointer"
                                >
                                  <Camera className="w-3.5 h-3.5 text-[#ae5d2e]" />
                                  <span>Attach Bank Transfer Screenshot (Optional)</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 3: JazzCash / Easypaisa */}
                  <label className="p-4 flex items-start gap-3 cursor-pointer hover:bg-[#faf8f5] transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa_jazzcash"
                      checked={paymentMethod === "easypaisa_jazzcash"}
                      onChange={() => setPaymentMethod("easypaisa_jazzcash")}
                      className="mt-1 text-[#203a27] focus:ring-[#203a27]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#182b1d]">
                          JazzCash / Easypaisa
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#ae5d2e]">
                          <Wallet className="w-3.5 h-3.5" />
                          <span className="font-mono text-[10px] uppercase font-bold">Mobile Account</span>
                        </div>
                      </div>

                      {paymentMethod === "easypaisa_jazzcash" && (
                        <div className="mt-3 p-4 rounded-xl bg-[#faf8f5] border border-[#e5dec9] text-xs space-y-3 animate-in fade-in">
                          <div className="p-3 bg-white rounded-lg border border-[#e8e2d8] space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[#687751]">Account Title:</span>
                              <strong>Azlan Ahmad Khan</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#687751]">Mobile Number:</span>
                              <div className="flex items-center gap-1.5">
                                <strong className="font-mono text-sm text-[#ae5d2e]">0313 5074177</strong>
                                <button
                                  type="button"
                                  onClick={() => handleCopy("03135074177", "wallet")}
                                  className="text-[#ae5d2e] hover:text-[#182b1d] p-0.5"
                                  title="Copy Number"
                                >
                                  {copiedField === "wallet" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Transaction ID / TID (e.g. 1029384756)"
                              value={paymentReference}
                              onChange={(e) => setPaymentReference(e.target.value)}
                              className="w-full px-3 py-2 rounded bg-white border border-[#d8d0c3] text-xs text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27]"
                            />
                            <input
                              type="text"
                              placeholder="Sender Name or Number (e.g. 03xx-xxxxxxx)"
                              value={senderName}
                              onChange={(e) => setSenderName(e.target.value)}
                              className="w-full px-3 py-2 rounded bg-white border border-[#d8d0c3] text-xs text-[#182b1d] placeholder-[#8a9884] focus:outline-none focus:border-[#203a27]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* 5. Billing Address */}
              <div>
                <h2 className="text-base sm:text-lg font-serif font-medium text-[#182b1d] mb-3">
                  Billing address
                </h2>
                <div className="rounded-lg border border-[#d8d0c3] bg-white divide-y divide-[#e8e2d8] overflow-hidden text-sm">
                  <label className="p-3.5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="billingAddress"
                      checked={billingSame}
                      onChange={() => setBillingSame(true)}
                      className="text-[#203a27]"
                    />
                    <span>Same as shipping address</span>
                  </label>
                  <label className="p-3.5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="billingAddress"
                      checked={!billingSame}
                      onChange={() => setBillingSame(false)}
                      className="text-[#203a27]"
                    />
                    <span>Use a different billing address</span>
                  </label>
                </div>
              </div>

              {/* Complete Order Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-4 rounded-xl bg-[#203a27] hover:bg-[#182b1d] active:scale-[0.99] disabled:opacity-50 text-white font-medium text-sm uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#ae5d2e]" />
                      <span>Complete order</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-[11px] text-[#687751] mt-3">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#203a27]" />
                    SSL Encrypted Checkout
                  </span>
                  <span>•</span>
                  <span>Dispatched via TCS Express</span>
                </div>
              </div>

              {/* Policy Links */}
              <div className="pt-6 border-t border-[#e8e2d8] flex flex-wrap gap-4 text-xs text-[#52644e]">
                <button
                  type="button"
                  onClick={() => setActivePolicy("refund")}
                  className="hover:underline"
                >
                  Refund policy
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicy("shipping")}
                  className="hover:underline"
                >
                  Shipping policy
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicy("privacy")}
                  className="hover:underline"
                >
                  Privacy policy
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicy("terms")}
                  className="hover:underline"
                >
                  Terms of service
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Desktop Order Summary (5 cols) */}
          <div className="hidden lg:block lg:col-span-5 bg-white rounded-2xl border border-[#e8e2d8] p-6 shadow-sm sticky top-24">
            <h3 className="font-serif text-lg font-medium text-[#182b1d] mb-4 pb-3 border-b border-[#e8e2d8]">
              Order Summary
            </h3>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl bg-[#faf8f5] border border-[#e5dec9] overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.type === "oil" ? "/images/growth-potion.jpg" : "/images/frizz-guard.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#203a27] text-white text-[9px] font-mono flex items-center justify-center font-bold shadow">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#182b1d]">{item.name}</p>
                      <p className="text-xs text-[#687751]">{item.size}</p>
                    </div>
                  </div>
                  <span className="font-mono font-medium text-sm text-[#182b1d]">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#e8e2d8] mb-6">
              <form onSubmit={handleApplyDiscount} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code (try ANIYA10)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#d8d0c3] text-xs text-[#182b1d] uppercase placeholder:normal-case placeholder-[#8a9884] focus:outline-none focus:border-[#203a27]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#f0eae1] hover:bg-[#203a27] hover:text-white text-xs font-medium text-[#182b1d] transition cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {discountError && (
                <p className="text-[11px] text-red-600 mt-1">{discountError}</p>
              )}
              {discountApplied && (
                <p className="text-[11px] text-[#203a27] font-medium mt-1">
                  ✓ 10% discount applied!
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs text-[#52644e] pt-4 border-t border-[#e8e2d8]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-sm text-[#182b1d]">
                  Rs {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (TCS Express)</span>
                <span className="font-mono text-sm text-[#182b1d]">
                  {shippingFee === 0 ? "FREE" : `Rs ${shippingFee}`}
                </span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-[#ae5d2e] font-medium">
                  <span>Discount</span>
                  <span className="font-mono text-sm">-Rs {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-serif font-medium text-[#182b1d] pt-3 border-t border-[#e8e2d8]">
                <span>Total</span>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#687751] block font-normal">PKR</span>
                  <span className="font-mono text-xl text-[#ae5d2e] font-bold">
                    Rs {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Modals */}
      {activePolicy && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePolicy(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-[#e8e2d8] text-xs text-[#35452e] leading-relaxed max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={() => setActivePolicy(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            {activePolicy === "refund" && (
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-medium text-[#182b1d]">
                  Refund & Return Policy
                </h3>
                <p>
                  At Aniya Essentials, we stand behind the purity and quality of our botanical hair products. If your parcel arrives damaged or incorrect, please reach out to our team within 7 days of delivery with photos of the package.
                </p>
                <p>
                  We will arrange a free immediate replacement or full refund to your UBL / mobile account.
                </p>
              </div>
            )}

            {activePolicy === "shipping" && (
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-medium text-[#182b1d]">
                  Shipping Policy
                </h3>
                <p>
                  We deliver nationwide across Pakistan via TCS Express. All shipments include a live TCS tracking consignment number.
                </p>
                <p>
                  • <strong>Delivery Time:</strong> 3 to 5 business days.<br />
                  • <strong>Standard Shipping:</strong> PKR 200.<br />
                  • <strong>Free Shipping:</strong> Automatically applied on all orders over PKR 2,500.
                </p>
              </div>
            )}

            {activePolicy === "privacy" && (
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-medium text-[#182b1d]">
                  Privacy Policy
                </h3>
                <p>
                  Your privacy is sacred to us. All customer details are strictly used for shipping and delivering your order via TCS Courier. We never share or sell customer data.
                </p>
              </div>
            )}

            {activePolicy === "terms" && (
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-medium text-[#182b1d]">
                  Terms of Service
                </h3>
                <p>
                  By placing an order on Aniya Essentials, you agree to receive authentic herbal hair care formulations handcrafted in Pakistan. Payment is collected via Cash on Delivery or confirmed UBL Bank transfer / JazzCash / Easypaisa.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
