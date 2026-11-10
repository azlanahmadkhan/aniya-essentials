"use client";

import React from "react";

export function BotanicalLeaf({
  className = "",
  variant = 1,
  color = "#687751",
  opacity = 0.6,
}: {
  className?: string;
  variant?: 1 | 2 | 3;
  color?: string;
  opacity?: number;
}) {
  if (variant === 2) {
    // Fern / Compound Botanical frond
    return (
      <svg
        viewBox="0 0 120 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ opacity }}
      >
        <path
          d="M60 210 Q65 140 50 10"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Leaflets */}
        <path d="M52 35 C40 30 30 38 48 48" fill={color} />
        <path d="M54 38 C68 32 78 40 58 50" fill={color} />
        <path d="M49 65 C32 60 22 70 45 80" fill={color} />
        <path d="M54 68 C72 62 82 72 58 82" fill={color} />
        <path d="M48 100 C28 92 18 105 44 118" fill={color} />
        <path d="M55 104 C78 96 88 108 59 120" fill={color} />
        <path d="M50 140 C28 132 18 148 46 160" fill={color} />
        <path d="M58 144 C84 136 94 150 62 162" fill={color} />
      </svg>
    );
  }

  if (variant === 3) {
    // Delicate Ginkgo / Laurel curved leaf
    return (
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ opacity }}
      >
        <path
          d="M20 140 C40 100 80 50 140 20 C110 60 60 110 20 140 Z"
          fill={color}
        />
        <path
          d="M20 140 Q75 80 140 20"
          stroke="#f6f2e9"
          strokeWidth="1"
          opacity="0.4"
        />
      </svg>
    );
  }

  // Classic Laurel/Rosemary leaf
  return (
    <svg
      viewBox="0 0 100 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <path
        d="M50 10 C20 60 20 120 50 170 C80 120 80 60 50 10 Z"
        fill={color}
      />
      <path
        d="M50 10 L50 170"
        stroke="#182b1d"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* Side veins */}
      <path d="M50 50 Q35 65 30 75" stroke="#182b1d" strokeWidth="1" opacity="0.25" />
      <path d="M50 65 Q65 80 70 90" stroke="#182b1d" strokeWidth="1" opacity="0.25" />
      <path d="M50 95 Q35 110 32 120" stroke="#182b1d" strokeWidth="1" opacity="0.25" />
      <path d="M50 115 Q65 130 68 140" stroke="#182b1d" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

export function BotanicalVine({
  className = "",
  id = "botanical-vine",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg
      id={id}
      viewBox="0 0 80 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        className="vine-stem"
        d="M40 0 Q60 100 30 200 T50 400 T30 600"
        stroke="#ae5d2e"
        strokeWidth="2"
        strokeDasharray="800"
        strokeDashoffset="0"
        fill="none"
      />
      <circle cx="40" cy="50" r="4" fill="#aab79a" />
      <path d="M40 90 C25 80 20 95 38 102 Z" fill="#687751" opacity="0.8" />
      <path d="M38 150 C55 140 60 155 42 162 Z" fill="#687751" opacity="0.8" />
      <circle cx="32" cy="240" r="5" fill="#ae5d2e" opacity="0.7" />
      <path d="M32 290 C15 280 10 295 28 302 Z" fill="#687751" opacity="0.8" />
      <path d="M48 370 C65 360 70 375 52 382 Z" fill="#687751" opacity="0.8" />
      <circle cx="48" cy="450" r="4" fill="#aab79a" />
      <path d="M32 510 C15 500 10 515 28 522 Z" fill="#687751" opacity="0.8" />
    </svg>
  );
}
