import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface ReviewItem {
  id: string;
  productId: "growth-potion" | "frizz-guard" | string;
  author: string;
  city?: string;
  rating: number; // 1 to 5
  comment: string;
  images?: string[]; // Array of base64 data URLs or image links
  date: string;
  verified: boolean;
}

const DEFAULT_REVIEWS: ReviewItem[] = [];

function getReviewsFilePath(): string {
  return path.join(process.cwd(), "data", "reviews.json");
}

function readReviews(): ReviewItem[] {
  try {
    const filePath = getReviewsFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read reviews file:", err);
  }
  return DEFAULT_REVIEWS;
}

function writeReviews(reviews: ReviewItem[]): void {
  try {
    const filePath = getReviewsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save reviews file:", err);
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const allReviews = readReviews();

  if (productId) {
    const filtered = allReviews.filter((r) => r.productId === productId);
    return NextResponse.json({ reviews: filtered });
  }

  return NextResponse.json({ reviews: allReviews });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, author, city, rating, comment, images } = body;

    if (!productId || !author?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { error: "Product selection, your name, and a review comment are required." },
        { status: 400 }
      );
    }

    const starRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Clean up images array if provided (limit to max 3 photos)
    const validImages = Array.isArray(images)
      ? images.filter((img) => typeof img === "string" && img.startsWith("data:image/")).slice(0, 3)
      : [];

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      productId,
      author: author.trim(),
      city: city?.trim() || "Pakistan",
      rating: starRating,
      comment: comment.trim(),
      images: validImages,
      date: dateFormatted,
      verified: true,
    };

    const currentReviews = readReviews();
    const updated = [newReview, ...currentReviews];
    writeReviews(updated);

    return NextResponse.json({
      success: true,
      review: newReview,
      reviews: updated,
    });
  } catch (err) {
    console.error("Error submitting review:", err);
    return NextResponse.json(
      { error: "Internal server error submitting review" },
      { status: 500 }
    );
  }
}
