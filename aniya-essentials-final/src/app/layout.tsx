import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aniya Essentials — Simple, Natural Hair Care",
  description:
    "Simple hair care with Aniya Essentials. Featuring Growth Potion Hair Oil (200 ml) and Frizz Guard Hair Spray (100 ml).",
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-[#182b1d] text-[#f6f2e9] antialiased selection:bg-[#ae5d2e] selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
