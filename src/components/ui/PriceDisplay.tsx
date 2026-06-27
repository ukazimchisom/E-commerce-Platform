"use client";

import { useExchangeRate } from "@/hooks/useExchangeRate";
import { formatNairaFromUsd, formatCurrency } from "@/utils/format";

interface PriceDisplayProps {
  usdAmount: number;
  size?: "sm" | "md" | "lg";
  showUsd?: boolean;
  className?: string;
}

const nairaStyles = {
  sm: "text-base font-bold text-gray-900",
  md: "text-xl font-bold text-gray-900",
  lg: "text-4xl font-extrabold text-gray-900",
};

const usdStyles = {
  sm: "text-xs text-gray-400",
  md: "text-sm text-gray-400",
  lg: "text-base text-gray-400",
};

export default function PriceDisplay({
  usdAmount,
  size = "md",
  showUsd = true,
  className = "",
}: PriceDisplayProps) {
  const { rate, isLoading } = useExchangeRate();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div
          className={`bg-gray-200 rounded ${
            size === "lg" ? "h-9 w-40" : size === "md" ? "h-6 w-28" : "h-5 w-20"
          }`}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={nairaStyles[size]}>
        {formatNairaFromUsd(usdAmount, rate)}
      </span>
      {showUsd && <span className={usdStyles[size]}>${usdAmount}</span>}
    </div>
  );
}
