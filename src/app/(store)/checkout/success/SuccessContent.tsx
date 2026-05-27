"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
        Order Confirmed!
      </h1>

      <p className="text-gray-500 mb-2">
        Thank you for your purchase. Your order has been placed and is being
        processed.
      </p>

      {orderId && (
        <p className="text-sm text-gray-400 mb-8">
          Order ID:{" "}
          <span className="font-mono text-gray-600">
            {orderId.slice(0, 8).toUpperCase()}
          </span>
        </p>
      )}

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          {
            label: "Order Placed",
            sub: "Just now",
            done: true,
          },
          {
            label: "Processing",
            sub: "In progress",
            done: true,
          },
          {
            label: "Shipped",
            sub: "Coming soon",
            done: false,
          },
        ].map((step) => (
          <div
            key={step.label}
            className={`p-4 rounded-2xl border text-center ${
              step.done
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <p
              className={`text-xs font-semibold ${
                step.done ? "text-green-800" : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">{step.sub}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {orderId && (
          <Link href="/dashboard/orders">
            <Button variant="outline" size="lg">
              View My Orders
            </Button>
          </Link>
        )}
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
