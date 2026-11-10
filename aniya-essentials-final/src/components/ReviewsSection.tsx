"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  CheckCircle2,
  Send,
  MessageSquarePlus,
  Sparkles,
  Camera,
  X,
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";

export interface ReviewItem {
  id: string;
  productId: string;
  author: string;
  city?: string;
  rating: number;
  comment: string;
  images?: string[];
  date: string;
  verified: boolean;
}

const PRODUCTS_LIST = [
  { id: "growth-potion", name: "Growth Potion Hair Oil (200 ml)" },
  { id: "frizz-guard", name: "Frizz Guard Hair Spray (100 ml)" },
];

/**
 * Client-side helper to compress and resize images into compact JPEG base64 strings
 * Keeps uploads fast, mobile-friendly, and lightweight.
 */
function compressImage(file: File, maxDim = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Form states
  const [selectedProduct, setSelectedProduct] = useState("growth-potion");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [authorCity, setAuthorCity] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lightbox Modal state
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load reviews on mount
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    }
    fetchReviews();
  }, []);

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return "5 Stars — Excellent / Loved it!";
      case 4:
        return "4 Stars — Very Good";
      case 3:
        return "3 Stars — Good";
      case 2:
        return "2 Stars — Fair";
      case 1:
        return "1 Star — Poor";
      default:
        return "";
    }
  };

  // Handle Photo File Selection
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const remainingSlots = 3 - images.length;
    if (remainingSlots <= 0) return;

    const toProcess = filesArray.slice(0, remainingSlots);
    setIsCompressing(true);

    try {
      const compressedList = await Promise.all(
        toProcess.map((file) => compressImage(file))
      );
      setImages((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error("Error processing photos:", err);
      setErrorMsg("Failed to process photo. Please choose a JPG or PNG.");
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!authorName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!comment.trim()) {
      setErrorMsg("Please write your review comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          author: authorName,
          city: authorCity || "Pakistan",
          rating,
          comment,
          images,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        if (data.reviews) {
          setReviews(data.reviews);
        } else if (data.review) {
          setReviews([data.review, ...reviews]);
        }
        setAuthorName("");
        setAuthorCity("");
        setComment("");
        setImages([]);
        setRating(5);
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 4000);
      } else {
        setErrorMsg(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews =
    activeFilter === "all"
      ? reviews
      : reviews.filter((r) => r.productId === activeFilter);

  const getProductName = (id: string) => {
    const p = PRODUCTS_LIST.find((item) => item.id === id);
    return p ? p.name : id;
  };

  return (
    <section
      id="reviews"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#142318] text-[#f6f2e9] overflow-hidden border-t border-[#f6f2e9]/10"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#ae5d2e]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#203a27] border border-[#f6f2e9]/15 text-[#aab79a] text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3 h-3 text-[#ae5d2e]" />
            Community Experiences
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#f6f2e9] font-normal tracking-tight">
            Customer Reviews
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#aab79a] max-w-md mx-auto font-light leading-relaxed">
            Real feedback from our customers. We do not use fake reviews — every review here is genuinely submitted.
          </p>
        </div>

        {/* 2-Column Grid: Left is Review Form with Photo Upload, Right is Real Reviews List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Column 1: Review Space / Submission Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#1e3424] rounded-3xl p-6 sm:p-8 border border-[#f6f2e9]/12 shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-2.5 mb-2">
              <MessageSquarePlus className="w-5 h-5 text-[#ae5d2e]" />
              <h3 className="font-serif text-xl sm:text-2xl text-[#f6f2e9]">
                Write a Review
              </h3>
            </div>
            <p className="text-xs text-[#aab79a] font-light mb-6">
              Share your honest feedback, hair results, and photos.
            </p>

            {submitSuccess ? (
              <div className="p-5 rounded-2xl bg-[#2a4d33] border border-[#ae5d2e]/40 text-center animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-[#ae5d2e] mx-auto mb-2" />
                <h4 className="font-serif text-base text-[#f6f2e9] font-medium">
                  Review Submitted!
                </h4>
                <p className="text-xs text-[#d5ddc9] mt-1 font-light">
                  Thank you for sharing your experience with Aniya Essentials. Your review and photos are now visible below.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-xs text-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* 1. Select Product */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#aab79a] mb-1.5">
                    Select Product *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#142318] border border-[#f6f2e9]/15 text-xs text-[#f6f2e9] focus:outline-none focus:border-[#ae5d2e]"
                  >
                    {PRODUCTS_LIST.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Interactive Star Rating Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#aab79a] mb-1.5">
                    Your Rating (Click stars to rate) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const active =
                          hoverRating > 0 ? val <= hoverRating : val <= rating;
                        return (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setRating(val)}
                            onMouseEnter={() => setHoverRating(val)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                            aria-label={`Rate ${val} stars`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                active
                                  ? "fill-[#e48349] text-[#e48349]"
                                  : "text-[#aab79a]/30"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#e48349] font-mono mt-1 font-medium">
                    {getRatingLabel(hoverRating || rating)}
                  </div>
                </div>

                {/* 3. Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#aab79a] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ayesha Khan"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#142318] border border-[#f6f2e9]/15 text-xs text-[#f6f2e9] placeholder-[#aab79a]/40 focus:outline-none focus:border-[#ae5d2e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#aab79a] mb-1.5">
                      City (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore / Karachi"
                      value={authorCity}
                      onChange={(e) => setAuthorCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#142318] border border-[#f6f2e9]/15 text-xs text-[#f6f2e9] placeholder-[#aab79a]/40 focus:outline-none focus:border-[#ae5d2e]"
                    />
                  </div>
                </div>

                {/* 4. Comment Space */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#aab79a] mb-1.5">
                    Your Review *
                  </label>
                  <textarea
                    placeholder="Write your honest experience with this product... (e.g. How does it smell? How does your hair feel after use?)"
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#142318] border border-[#f6f2e9]/15 text-xs text-[#f6f2e9] placeholder-[#aab79a]/40 focus:outline-none focus:border-[#ae5d2e] resize-none"
                  />
                </div>

                {/* 5. IMAGE UPLOADING SPACE */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#aab79a] flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#ae5d2e]" />
                      <span>Add Photos (Optional)</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#aab79a]/70">
                      {images.length}/3 photos
                    </span>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  {/* Upload area & Previews */}
                  <div className="space-y-2.5">
                    {/* Thumbnails grid */}
                    {images.length > 0 && (
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#ae5d2e]/60 shadow-sm group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt={`Upload preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload button box */}
                    {images.length < 3 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCompressing}
                        className="w-full py-3 px-4 rounded-xl border border-dashed border-[#f6f2e9]/20 hover:border-[#ae5d2e] bg-[#142318]/60 hover:bg-[#142318] transition-all flex items-center justify-center gap-2 text-xs text-[#aab79a] hover:text-[#f6f2e9] cursor-pointer"
                      >
                        {isCompressing ? (
                          <span>Processing photo...</span>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4 text-[#ae5d2e]" />
                            <span>
                              {images.length === 0
                                ? "Click to upload photos (Hair results, texture, unboxing)"
                                : "+ Add another photo"}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* 6. Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing}
                  className="w-full py-3.5 rounded-full bg-[#ae5d2e] hover:bg-[#8e4922] disabled:opacity-50 text-[#f6f2e9] text-xs font-medium uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Submitting Review...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Post Review</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Column 2: Genuine Reviews List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#aab79a] mr-1">Filter:</span>
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#ae5d2e] text-[#f6f2e9]"
                    : "bg-[#1e3424] text-[#aab79a] hover:text-[#f6f2e9]"
                }`}
              >
                All Products ({reviews.length})
              </button>
              <button
                onClick={() => setActiveFilter("growth-potion")}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === "growth-potion"
                    ? "bg-[#ae5d2e] text-[#f6f2e9]"
                    : "bg-[#1e3424] text-[#aab79a] hover:text-[#f6f2e9]"
                }`}
              >
                Growth Potion (
                {reviews.filter((r) => r.productId === "growth-potion").length})
              </button>
              <button
                onClick={() => setActiveFilter("frizz-guard")}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === "frizz-guard"
                    ? "bg-[#ae5d2e] text-[#f6f2e9]"
                    : "bg-[#1e3424] text-[#aab79a] hover:text-[#f6f2e9]"
                }`}
              >
                Frizz Guard (
                {reviews.filter((r) => r.productId === "frizz-guard").length})
              </button>
            </div>

            {/* Empty State: Absolutely NO fake reviews */}
            {filteredReviews.length === 0 ? (
              <div className="rounded-3xl bg-[#1e3424]/60 border border-dashed border-[#f6f2e9]/15 p-10 text-center flex flex-col items-center justify-center min-h-[320px]">
                <div className="w-14 h-14 rounded-full bg-[#203a27] border border-[#f6f2e9]/10 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-[#ae5d2e]/70" />
                </div>
                <h4 className="font-serif text-xl text-[#f6f2e9] font-normal mb-2">
                  No Reviews Yet
                </h4>
                <p className="text-xs sm:text-sm text-[#aab79a] font-light max-w-sm leading-relaxed mb-5">
                  We don’t add automated or fake reviews. Have you tried Growth Potion or Frizz Guard? Be the first to share your experience and photos using the form on the left!
                </p>
                <div className="flex items-center gap-1 text-[#ae5d2e]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#ae5d2e]/30 text-[#ae5d2e]" />
                  ))}
                </div>
              </div>
            ) : (
              /* Real Reviews List */
              <div className="space-y-4">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#1e3424] border border-[#f6f2e9]/10 shadow-sm transition-all hover:border-[#ae5d2e]/40"
                  >
                    {/* Header: Author, Product & Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm sm:text-base font-medium text-[#f6f2e9]">
                          {rev.author}
                        </span>
                        {rev.city && (
                          <span className="text-xs text-[#aab79a] font-light">
                            • {rev.city}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#f6f2e9] bg-[#2a4d33] px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-[#ae5d2e]" />
                          Verified
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#aab79a]/70">
                        {rev.date}
                      </span>
                    </div>

                    {/* Product Tag & Star Rating */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating
                                ? "fill-[#e48349] text-[#e48349]"
                                : "text-[#aab79a]/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#ae5d2e] bg-[#ae5d2e]/10 px-2.5 py-0.5 rounded-full">
                        {getProductName(rev.productId)}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs sm:text-sm text-[#f6f2e9]/90 font-light leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    {/* Attached Customer Photos */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#f6f2e9]/10">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#aab79a] flex items-center gap-1 mb-2">
                          <Camera className="w-3 h-3 text-[#ae5d2e]" />
                          <span>Customer Photos ({rev.images.length})</span>
                        </div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {rev.images.map((imgSrc, imgIdx) => (
                            <button
                              key={imgIdx}
                              type="button"
                              onClick={() => setActiveModalImage(imgSrc)}
                              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#f6f2e9]/20 hover:border-[#ae5d2e] shadow-sm hover:scale-105 transition-all group cursor-pointer focus:outline-none"
                              aria-label="View photo in full screen"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imgSrc}
                                alt={`Customer review photo ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ZoomIn className="w-4 h-4 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Screen Image Preview */}
      {activeModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModalImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#f6f2e9]/20 shadow-2xl bg-[#182b1d]"
          >
            {/* Close button */}
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Full-size Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeModalImage}
              alt="Customer review photo large"
              className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
