"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";

export interface ReviewItem {
  id: string;
  productId: string;
  author: string;
  city?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: "growth-potion" | "frizz-guard" | string;
  productName: string;
}

export default function ProductReviews({
  productId,
  productName,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWriteForm, setShowWriteForm] = useState(false);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [authorCity, setAuthorCity] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch reviews on mount
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    }
    loadReviews();
  }, [productId]);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  const handleStarClick = (val: number) => {
    setRating(val);
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return "5 - Excellent / Loved it!";
      case 4:
        return "4 - Very Good";
      case 3:
        return "3 - Good";
      case 2:
        return "2 - Fair";
      case 1:
        return "1 - Poor";
      default:
        return "";
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
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
          productId,
          author: authorName,
          city: authorCity || "Pakistan",
          rating,
          comment,
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
        setRating(5);
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowWriteForm(false);
        }, 3000);
      } else {
        setErrorMsg(data.error || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-4 pt-3 border-t border-[#203a27]/10">
      {/* Review Summary Pill & Expand Toggle */}
      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 group cursor-pointer focus:outline-none text-left"
          aria-expanded={isExpanded}
        >
          {/* Star Icons */}
          <div className="flex items-center text-[#ae5d2e]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3.5 h-3.5 fill-[#ae5d2e] text-[#ae5d2e]"
              />
            ))}
          </div>
          <span className="font-mono font-medium text-[#182b1d] group-hover:text-[#ae5d2e] transition-colors">
            {averageRating}
          </span>
          <span className="text-[#687751] font-light">
            ({reviews.length} {reviews.length === 1 ? "Review" : "Reviews"})
          </span>
          <span className="text-[11px] text-[#ae5d2e] underline font-medium ml-1">
            {isExpanded ? "Hide" : "See Reviews"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsExpanded(true);
            setShowWriteForm(!showWriteForm);
          }}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide bg-[#203a27]/10 hover:bg-[#203a27] hover:text-[#f6f2e9] text-[#203a27] transition-all cursor-pointer"
        >
          {showWriteForm ? "Close Form" : "Write a Review"}
        </button>
      </div>

      {/* Expanded Review Section */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-[#203a27]/8 space-y-4 animate-in fade-in duration-300">
          {/* Write a Review Box */}
          {showWriteForm && (
            <div className="p-4 rounded-2xl bg-[#1e3424] text-[#f6f2e9] shadow-md border border-[#f6f2e9]/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif text-sm text-[#f6f2e9] font-medium">
                  Review &ldquo;{productName}&rdquo;
                </h4>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#aab79a]">
                  Share your experience
                </span>
              </div>

              {submitSuccess ? (
                <div className="p-3 rounded-xl bg-[#2a4d33] border border-[#aab79a]/30 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#d5ddc9] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#ae5d2e]" />
                    <span>Thank you! Your review has been posted.</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  {errorMsg && (
                    <div className="p-2 rounded-lg bg-red-900/40 border border-red-500/30 text-[11px] text-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Interactive Star Rating Selector */}
                  <div>
                    <label className="block text-[11px] text-[#aab79a] mb-1 font-light">
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
                              onClick={() => handleStarClick(val)}
                              onMouseEnter={() => setHoverRating(val)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                              aria-label={`Rate ${val} stars`}
                            >
                              <Star
                                className={`w-5 h-5 transition-colors ${
                                  active
                                    ? "fill-[#e48349] text-[#e48349]"
                                    : "text-[#aab79a]/40"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[11px] text-[#e48349] font-medium ml-2 font-mono">
                        {getRatingLabel(hoverRating || rating)}
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Name and City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Ayesha Khan) *"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#142318] border border-[#f6f2e9]/15 text-xs text-[#f6f2e9] placeholder-[#aab79a]/50 focus:outline-none focus:border-[#ae5d2e]"
                    />
                    <input
                      type="text"
                      placeholder="City (e.g. Lahore / Karachi)"
                      value={authorCity}
                      onChange={(e) => setAuthorCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#142318] border border-[#f6f2e9]/15 text-xs text-[#f6f2e9] placeholder-[#aab79a]/50 focus:outline-none focus:border-[#ae5d2e]"
                    />
                  </div>

                  {/* Comment Space */}
                  <div>
                    <textarea
                      placeholder="Write your review: How did it feel? What changes did you notice in your hair? *"
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#142318] border border-[#f6f2e9]/15 text-xs text-[#f6f2e9] placeholder-[#aab79a]/50 focus:outline-none focus:border-[#ae5d2e] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-[#ae5d2e] hover:bg-[#8e4922] disabled:opacity-50 text-[#f6f2e9] text-xs font-medium uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <span>Submitting Review...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Customer Reviews List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-2xl bg-[#efebe1] border border-[#203a27]/10 text-[#203a27] transition-all hover:border-[#ae5d2e]/30"
              >
                {/* Reviewer Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-xs text-[#182b1d]">
                      {rev.author}
                    </span>
                    {rev.city && (
                      <span className="text-[10px] text-[#687751]">
                        • {rev.city}
                      </span>
                    )}
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono uppercase tracking-wider text-[#203a27] bg-[#203a27]/10 px-1.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#ae5d2e]" />
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#687751]/80">
                    {rev.date}
                  </span>
                </div>

                {/* Star display */}
                <div className="flex items-center gap-0.5 mb-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= rev.rating
                          ? "fill-[#ae5d2e] text-[#ae5d2e]"
                          : "text-[#203a27]/20"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment body */}
                <p className="text-xs text-[#35452e] font-light leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
