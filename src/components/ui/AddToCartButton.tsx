"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types/products";
import { ShoppingBag } from "lucide-react";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock === 0;
  const inCart = isInCart(product.id);
  const currentCartQty = getItemQuantity(product.id);
  const remainingStock = product.stock - currentCartQty;
  const atStockLimit = remainingStock <= 0;

  const decrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increment = () => {
    setQuantity((prev) => Math.min(prev + 1, remainingStock));
  };

  const handleAddToCart = () => {
    if (atStockLimit) {
      toast.error(
        `Only ${product.stock} in stock — you already have ${currentCartQty} in your cart.`,
      );
      return;
    }

    // Add the item as many times as the selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }

    toast.success(
      quantity > 1
        ? `${quantity}× ${product.title} added to cart!`
        : `${product.title} added to cart!`,
    );

    setJustAdded(true);
    setQuantity(1); // reset selector after adding

    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      {!isOutOfStock && !atStockLimit && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>

          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
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
                  d="M20 12H4"
                />
              </svg>
            </button>

            <span className="w-12 text-center text-sm font-semibold text-gray-900 select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increment}
              disabled={quantity >= remainingStock}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Stock hint */}
          <span className="text-xs text-gray-400">
            {remainingStock} available
            {inCart && ` (${currentCartQty} already in cart)`}
          </span>
        </div>
      )}

      {/* Add to cart button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isOutOfStock || atStockLimit}
          variant={justAdded ? "secondary" : "primary"}
        >
          {justAdded ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              Added!
            </>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : atStockLimit ? (
            "Max Stock in Cart"
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={2} />
              </svg>
              {inCart
                ? `Add ${quantity > 1 ? `${quantity} More` : "Another"}`
                : `Add ${quantity > 1 ? `${quantity} to Cart` : "to Cart"}`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
