"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle2,
  Truck,
  Building2,
  ExternalLink,
} from "lucide-react";

interface Order {
  orderId: string;
  timestamp: string;
  status: string;
  paymentMethod: string;
  paymentReference?: string;
  senderName?: string;
  courier?: string;
  trackingNumber?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#182b1d] text-[#f6f2e9] p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-[#f6f2e9]/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#203a27] text-[#f6f2e9] text-[10px] font-mono uppercase tracking-widest mb-2">
              Aniya Essentials Admin
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#f6f2e9]">Customer Orders</h1>
            <p className="text-xs text-[#aab79a] mt-1">
              Live orders database • Bank: UBL (Azlan Ahmad Khan) • Courier: TCS Express • Email: aniyaessentials@gmail.com
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 rounded-full bg-[#203a27] hover:bg-[#2e4c34] text-xs flex items-center gap-2 border border-[#f6f2e9]/15 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-[#ae5d2e] hover:bg-[#8e4922] text-xs uppercase tracking-wider font-medium text-white transition-colors"
            >
              View Website
            </Link>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-20 text-xs text-[#aab79a] font-mono">
            Loading orders from data/orders.json...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-[#203a27]/40 rounded-2xl border border-[#f6f2e9]/10">
            <ShoppingBag className="w-12 h-12 text-[#aab79a]/40 mx-auto mb-3" />
            <h3 className="font-serif text-xl">No Orders Yet</h3>
            <p className="text-xs text-[#aab79a] mt-1">
              Orders placed on your website will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const dateStr = new Date(order.timestamp).toLocaleString("en-PK", {
                timeZone: "Asia/Karachi",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              const isBank = order.paymentMethod?.includes("Bank") || order.paymentMethod?.includes("UBL");
              const isWallet = order.paymentMethod?.includes("Easypaisa") || order.paymentMethod?.includes("JazzCash");

              return (
                <div
                  key={order.orderId}
                  className="p-6 rounded-2xl bg-[#203a27]/60 border border-[#f6f2e9]/10 hover:border-[#ae5d2e]/40 transition-colors flex flex-col lg:flex-row justify-between gap-6"
                >
                  {/* Left: Customer & Delivery Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm text-[#ae5d2e] font-bold bg-[#142318] px-2.5 py-1 rounded-lg border border-[#f6f2e9]/10">
                        #{order.orderId}
                      </span>
                      <span className="text-[11px] font-mono text-[#aab79a] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-green-300 bg-green-950/80 px-2 py-0.5 rounded-full border border-green-800">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        {order.status || "Confirmed"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-serif text-[#f6f2e9] font-medium">
                        {order.customer.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#d5ddc9]">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#ae5d2e] shrink-0" />
                        <a href={`tel:${order.customer.phone}`} className="hover:underline font-mono">
                          {order.customer.phone}
                        </a>
                      </div>
                      {order.customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#ae5d2e] shrink-0" />
                          <a href={`mailto:${order.customer.email}`} className="hover:underline">
                            {order.customer.email}
                          </a>
                        </div>
                      )}
                      <div className="flex items-start gap-2 sm:col-span-2 text-[#aab79a]">
                        <MapPin className="w-3.5 h-3.5 text-[#ae5d2e] shrink-0 mt-0.5" />
                        <span>{order.customer.address}</span>
                      </div>
                    </div>

                    {/* Payment verification badge */}
                    <div className="p-3 rounded-xl bg-[#142318] border border-[#f6f2e9]/10 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#aab79a]">Payment Method:</span>
                        <span className="font-semibold text-[#f6f2e9]">{order.paymentMethod}</span>
                      </div>
                      {order.paymentReference && (
                        <div className="flex items-center justify-between pt-1 border-t border-[#f6f2e9]/5">
                          <span className="text-[#ae5d2e] font-mono">Transaction ID (TID):</span>
                          <strong className="font-mono text-white bg-[#203a27] px-2 py-0.5 rounded">
                            {order.paymentReference}
                          </strong>
                        </div>
                      )}
                      {order.senderName && (
                        <div className="flex items-center justify-between text-[11px] text-[#aab79a]">
                          <span>Sender Name:</span>
                          <span className="text-[#f6f2e9]">{order.senderName}</span>
                        </div>
                      )}
                    </div>

                    {/* TCS Courier Tracking CN */}
                    <div className="flex items-center justify-between text-xs text-[#aab79a] pt-1">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Truck className="w-3.5 h-3.5 text-[#ae5d2e]" />
                        TCS CN: <strong className="text-white">{order.trackingNumber || "Assigned upon dispatch"}</strong>
                      </span>
                      <Link
                        href={`/track?id=${order.orderId}`}
                        target="_blank"
                        className="text-[#ae5d2e] hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Live Tracking</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Right: Items & Total */}
                  <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-[#f6f2e9]/10 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] uppercase tracking-widest text-[#aab79a] font-mono block">
                        Ordered Products
                      </span>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-[#f6f2e9]">
                            {item.quantity}x {item.name} ({item.size})
                          </span>
                          <span className="font-mono text-[#d5ddc9]">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#f6f2e9]/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#aab79a] block">Total Payable</span>
                        <span className="font-serif text-lg text-[#ae5d2e] font-semibold">
                          PKR {order.total.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#aab79a] bg-[#142318] px-2.5 py-1 rounded">
                        TCS Courier
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
