"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types/products";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock === 0;
  const inCart = isInCart(product.id);
  const currentQty = getItemQuantity(product.id);
  const atStockLimit = currentQty >= product.stock;

  const handleAddToCart = () => {
    if (atStockLimit) {
      toast.error(`Only ${product.stock} in stock.`);
      return;
    }

    addItem(product);
    setJustAdded(true);
    toast.success(
      inCart
        ? `Quantity updated (${currentQty + 1})`
        : `${product.title} added to cart!`,
    );

    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
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
          "Max Stock Reached"
        ) : (
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {inCart ? "Add Another" : "Add to Cart"}
          </>
        )}
      </Button>
    </div>
  );
}
