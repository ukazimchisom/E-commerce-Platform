"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

export default function CartBadge() {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCount = mounted ? totalItems : 0;

  return (
    <Link
      href="/cart"
      className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      aria-label={`Cart (${displayCount} items)`}
    >
      <ShoppingCart />

      {displayCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {displayCount > 9 ? "9+" : displayCount}
        </span>
      )}
    </Link>
  );
}
