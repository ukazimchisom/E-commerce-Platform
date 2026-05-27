"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start shopping and your items will appear here."
          action={
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          }
          icon={<ShoppingCart />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Clear your entire cart?")) clearCart();
          }}
          className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity, unitPrice }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              {/* Product image */}
              <Link href={`/products/${product.id}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              </Link>

              {/* Product details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      {product.brand ?? product.category}
                    </p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Price + Quantity */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>

                    <span className="w-10 text-center text-sm font-semibold text-gray-900">
                      {quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">
                      ${(unitPrice * quantity).toFixed(2)}
                    </p>
                    {quantity > 1 && (
                      <p className="text-xs text-gray-400">${unitPrice} each</p>
                    )}
                  </div>
                </div>

                {/* Stock warning */}
                {product.stock < 10 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Only {product.stock} in stock
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Order Summary
            </h2>

            {/* Line items */}
            <div className="space-y-3 mb-5">
              {items.map(({ product, quantity, unitPrice }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[170px]">
                    {product.title}{" "}
                    <span className="text-gray-400">×{quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900 flex-shrink-0">
                    ${(unitPrice * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">
                  {totalPrice >= 50 ? "Free" : "$4.99"}
                </span>
              </div>
              {totalPrice < 50 && (
                <p className="text-xs text-gray-400">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-4 mb-6">
              <span>Total</span>
              <span>
                ${(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Proceed to Checkout
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="ghost" size="md" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>

            {/* Trust note */}
            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure & encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
