"use client";

import dynamic from "next/dynamic";

const CheckoutClient = dynamic(() => import("./CheckoutClient"), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-6 w-24 bg-gray-200 rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-5">
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-56 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  ),
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
