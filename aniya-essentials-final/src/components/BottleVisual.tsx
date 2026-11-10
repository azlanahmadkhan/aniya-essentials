"use client";

import React, { useState } from "react";

interface BottleVisualProps {
  type?: "oil" | "spray";
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  animateGlow?: boolean;
  imageSrc?: string;
  altText?: string;
  forceIllustration?: boolean;
}

export default function BottleVisual({
  type = "oil",
  className = "",
  size = "md",
  animateGlow = false,
  imageSrc,
  altText,
  forceIllustration = false,
}: BottleVisualProps) {
  const [imageError, setImageError] = useState(false);

  // If a real product photo is explicitly requested and has not errored out and illustration is not forced
  if (imageSrc && !imageError && !forceIllustration) {
    const sizeClasses = {
      sm: "w-16 h-20 rounded-xl",
      md: "w-44 sm:w-52 h-56 sm:h-64 rounded-2xl",
      lg: "w-56 sm:w-64 h-72 sm:h-80 rounded-3xl",
      hero: "w-[160px] sm:w-[220px] md:w-[270px] lg:w-[300px] h-[210px] sm:h-[310px] md:h-[380px] lg:h-[430px] rounded-2xl sm:rounded-[2rem]",
    };

    return (
      <div
        className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      >
        {animateGlow && (
          <div className="absolute inset-0 bg-[#ae5d2e]/30 blur-3xl rounded-full scale-110 pointer-events-none animate-glow" />
        )}
        <div className="w-full h-full overflow-hidden rounded-[inherit] shadow-[0_20px_50px_rgba(0,0,0,0.55)] border border-[#f6f2e9]/15 relative bg-[#182b1d]/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={altText || "Aniya Essentials Product"}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit] pointer-events-none" />
        </div>
      </div>
    );
  }

  // Sizing for Free-Standing Illustrated Bottles (transparent background, zero box frames)
  const illustrationSizes = {
    sm: "w-14 sm:w-16 h-24 sm:h-28",
    md: "w-32 sm:w-36 h-56 sm:h-64",
    lg: "w-44 sm:w-52 h-72 sm:h-84",
    hero: "w-[150px] sm:w-[190px] md:w-[230px] lg:w-[260px] h-[270px] sm:h-[330px] md:h-[390px] lg:h-[430px]",
  };

  // Illustrated Spray Bottle (Frizz Guard)
  if (type === "spray") {
    return (
      <div
        className={`relative flex items-center justify-center ${illustrationSizes[size]} ${className}`}
      >
        {animateGlow && (
          <div className="absolute inset-0 bg-[#687751]/25 blur-3xl rounded-full scale-125 pointer-events-none animate-glow" />
        )}
        <svg
          viewBox="0 0 240 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:scale-105"
        >
          <defs>
            {/* White Bottle Cylinder Shading */}
            <linearGradient id="sprayBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c5cdc0" />
              <stop offset="18%" stopColor="#e8ece4" />
              <stop offset="45%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#e2e8de" />
              <stop offset="100%" stopColor="#b6bfb0" />
            </linearGradient>

            {/* Label Green Gradient */}
            <linearGradient id="sprayLabelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#142618" />
              <stop offset="25%" stopColor="#1e3a24" />
              <stop offset="65%" stopColor="#24442b" />
              <stop offset="100%" stopColor="#132417" />
            </linearGradient>

            {/* Cap Translucency */}
            <linearGradient id="mistCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.45" />
              <stop offset="50%" stopColor="white" stopOpacity="0.15" />
              <stop offset="100%" stopColor="white" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Floor Shadow */}
          <ellipse cx="120" cy="485" rx="65" ry="10" fill="#040905" fillOpacity="0.65" filter="blur(6px)" />
          <ellipse cx="120" cy="485" rx="35" ry="4" fill="#000000" fillOpacity="0.9" />

          {/* Bottle Base Curve */}
          <path
            d="M60 455 C60 472 78 478 120 478 C162 478 180 472 180 455 L180 200 C180 180 165 170 145 165 L145 145 L95 145 L95 165 C75 170 60 180 60 200 Z"
            fill="url(#sprayBodyGrad)"
          />

          {/* Specular Highlight along bottle */}
          <path d="M82 195 L88 195 L88 465 L82 465 Z" fill="white" opacity="0.6" filter="blur(1px)" />

          {/* Wrap-around Forest Green Label */}
          <path
            d="M60 230 C75 234 105 237 120 237 C135 237 165 234 180 230 L180 420 C165 424 135 427 120 427 C105 427 75 424 60 420 Z"
            fill="url(#sprayLabelGrad)"
          />

          {/* Label Inner Sheen */}
          <path d="M82 233 L86 233 L86 422 L82 422 Z" fill="white" opacity="0.15" />

          {/* Label Content */}
          <text
            x="120"
            y="262"
            fill="#e8ece4"
            fontSize="7"
            fontFamily="serif"
            letterSpacing="0.28em"
            textAnchor="middle"
          >
            ANIYA ESSENTIALS
          </text>
          <line x1="88" y1="270" x2="152" y2="270" stroke="#ae5d2e" strokeWidth="0.8" opacity="0.85" />

          <text
            x="120"
            y="292"
            fill="#f6f2e9"
            fontSize="13"
            fontFamily="serif"
            fontWeight="bold"
            letterSpacing="0.08em"
            textAnchor="middle"
          >
            FRIZZ GUARD
          </text>

          <text
            x="120"
            y="307"
            fill="#aab79a"
            fontSize="6.5"
            fontFamily="sans-serif"
            letterSpacing="0.14em"
            textAnchor="middle"
          >
            ROSEMARY HAIRSPRAY
          </text>

          <text
            x="120"
            y="332"
            fill="#d5ddc9"
            fontSize="5.5"
            fontFamily="serif"
            fontStyle="italic"
            textAnchor="middle"
          >
            Rosemary Extract &amp; Argan Oil
          </text>

          <text
            x="120"
            y="375"
            fill="#687751"
            fontSize="4.8"
            fontFamily="monospace"
            letterSpacing="0.1em"
            textAnchor="middle"
          >
            handmade • cruelty-free
          </text>

          <text
            x="120"
            y="405"
            fill="#f6f2e9"
            fontSize="7"
            fontFamily="monospace"
            letterSpacing="0.15em"
            textAnchor="middle"
          >
            100 ml / 3.4 fl. oz.
          </text>

          {/* Spray Pump Mechanism */}
          <rect x="105" y="125" width="30" height="20" rx="3" fill="#e2e8de" />
          <path d="M110 125 L110 100 C110 94 130 94 130 100 L130 125 Z" fill="#f6f2e9" />
          <circle cx="120" cy="106" r="2.5" fill="#182b1d" />

          {/* Translucent Mist Cap sitting atop or tilted */}
          <rect
            x="100"
            y="70"
            width="40"
            height="55"
            rx="6"
            fill="url(#mistCapGrad)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
          <path d="M104 74 L108 74 L108 120 L104 120 Z" fill="white" opacity="0.45" />
        </svg>
      </div>
    );
  }

  // Master Illustrated Hair Oil Bottle (Growth Potion — Free-Standing Sculptural Visual)
  return (
    <div
      className={`relative flex items-center justify-center ${illustrationSizes[size]} ${className}`}
    >
      {animateGlow && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#ae5d2e]/30 via-[#35452e]/30 to-transparent blur-3xl rounded-full scale-125 pointer-events-none animate-glow" />
      )}
      <svg
        viewBox="0 0 320 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-out hover:scale-[1.03]"
      >
        <defs>
          {/* Deep Amber/Forest Glass Cylindrical Body */}
          <linearGradient id="oilGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#08140c" />
            <stop offset="15%" stopColor="#152719" />
            <stop offset="35%" stopColor="#25422b" />
            <stop offset="60%" stopColor="#1a3120" />
            <stop offset="85%" stopColor="#0f1f14" />
            <stop offset="100%" stopColor="#07110a" />
          </linearGradient>

          {/* Label Gradient matching the real bottle */}
          <linearGradient id="oilLabelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#172e1e" />
            <stop offset="20%" stopColor="#22422b" />
            <stop offset="50%" stopColor="#294e33" />
            <stop offset="80%" stopColor="#1e3c27" />
            <stop offset="100%" stopColor="#14291a" />
          </linearGradient>

          {/* Specular Rim Light */}
          <linearGradient id="oilSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.45" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Glossy Black Cap Gradient */}
          <linearGradient id="oilCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111111" />
            <stop offset="20%" stopColor="#2c2c2c" />
            <stop offset="45%" stopColor="#484848" />
            <stop offset="70%" stopColor="#222222" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          {/* Subtle Copper Collar */}
          <linearGradient id="oilCopperCollar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#55240c" />
            <stop offset="40%" stopColor="#ae5d2e" />
            <stop offset="70%" stopColor="#df8652" />
            <stop offset="100%" stopColor="#481c07" />
          </linearGradient>

          {/* Inner Botanical Leaf Glow Pattern on Label */}
          <radialGradient id="labelBotanicalGlow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#355e3c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1b3521" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Floor Shadow */}
        <ellipse cx="160" cy="600" rx="95" ry="14" fill="#030804" fillOpacity="0.8" filter="blur(8px)" />
        <ellipse cx="160" cy="598" rx="55" ry="6" fill="#000000" fillOpacity="0.95" />

        {/* Glass Bottle Body Silhouette */}
        <path
          d="M70 215 C70 185 95 172 125 166 L125 145 L195 145 L195 166 C225 172 250 185 250 215 L250 565 C250 588 225 595 160 595 C95 595 70 588 70 565 Z"
          fill="url(#oilGlassGrad)"
        />

        {/* Thick Glass Base Refraction Curve */}
        <path
          d="M76 560 C76 578 100 586 160 586 C220 586 244 578 244 560 L244 572 C244 586 220 592 160 592 C100 592 76 586 76 572 Z"
          fill="#33593a"
          opacity="0.3"
        />

        {/* Specular Reflection Line on Glass */}
        <rect x="94" y="200" width="8" height="365" rx="4" fill="url(#oilSpecular)" />
        <rect x="238" y="215" width="2" height="340" fill="white" opacity="0.15" />

        {/* The Exact Growth Potion Bottle Label */}
        <path
          d="M70 240 C95 246 135 249 160 249 C185 249 225 246 250 240 L250 535 C225 541 185 544 160 544 C135 544 95 541 70 535 Z"
          fill="url(#oilLabelGrad)"
        />

        {/* Soft Organic Wave Watermark on Label (Matches real bottle) */}
        <ellipse cx="160" cy="380" rx="80" ry="140" fill="url(#labelBotanicalGlow)" />
        <path
          d="M70 420 C110 390 190 440 250 400 L250 470 C190 510 110 460 70 490 Z"
          fill="#3a6442"
          opacity="0.08"
        />

        {/* Subtle Specular Sheen Over Label */}
        <rect x="94" y="243" width="8" height="295" rx="4" fill="white" opacity="0.1" />

        {/* Brand Header */}
        <text
          x="160"
          y="280"
          fill="#f6f2e9"
          fontSize="9"
          fontFamily="serif"
          letterSpacing="0.28em"
          textAnchor="middle"
        >
          ANIYA
        </text>
        <text
          x="160"
          y="294"
          fill="#aab79a"
          fontSize="6"
          fontFamily="serif"
          letterSpacing="0.35em"
          textAnchor="middle"
        >
          ESSENTIALS
        </text>

        {/* Copper Dividing Filament */}
        <line x1="120" y1="304" x2="200" y2="304" stroke="#ae5d2e" strokeWidth="1" opacity="0.9" />

        {/* Product Title: GROWTH POTION */}
        <text
          x="160"
          y="330"
          fill="#f6f2e9"
          fontSize="15"
          fontFamily="serif"
          fontWeight="bold"
          letterSpacing="0.08em"
          textAnchor="middle"
        >
          GROWTH POTION
        </text>

        {/* Subtitle: HAIR OIL */}
        <text
          x="160"
          y="348"
          fill="#d5ddc9"
          fontSize="7.5"
          fontFamily="sans-serif"
          letterSpacing="0.22em"
          textAnchor="middle"
        >
          HAIR OIL
        </text>

        {/* Natural Ingredients Description on Label */}
        <text
          x="160"
          y="375"
          fill="#e8ece4"
          fontSize="6.2"
          fontFamily="serif"
          fontStyle="italic"
          textAnchor="middle"
        >
          Infused With Rosemary, Fenugreek,
        </text>
        <text
          x="160"
          y="387"
          fill="#e8ece4"
          fontSize="6.2"
          fontFamily="serif"
          fontStyle="italic"
          textAnchor="middle"
        >
          Mustard &amp; Cloves
        </text>

        {/* Purity Badges */}
        <text
          x="160"
          y="470"
          fill="#aab79a"
          fontSize="5.2"
          fontFamily="monospace"
          letterSpacing="0.12em"
          textAnchor="middle"
        >
          handmade • cruelty-free • chemical-free
        </text>

        {/* Volume */}
        <text
          x="160"
          y="500"
          fill="#f6f2e9"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="0.18em"
          textAnchor="middle"
        >
          200 ml / 6.8 fl. oz.
        </text>

        {/* Copper Neck Ring / Collar */}
        <rect x="122" y="140" width="76" height="12" rx="2" fill="url(#oilCopperCollar)" />

        {/* Cylindrical Glossy Black Cap */}
        <rect x="126" y="65" width="68" height="75" rx="5" fill="url(#oilCapGrad)" />

        {/* Specular Gloss Line on Cap */}
        <rect x="138" y="67" width="6" height="71" rx="2" fill="white" opacity="0.3" filter="blur(0.5px)" />
        <line x1="126" y1="67" x2="194" y2="67" stroke="white" strokeWidth="0.8" opacity="0.3" />
      </svg>
    </div>
  );
}
