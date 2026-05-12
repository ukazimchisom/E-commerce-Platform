import { useCartStore } from "@/store/CartStore";
import type { Product } from "@/types/products";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const isInCart = (productId: number) =>
    items.some((item) => item.product.id === productId);

  const getItemQuantity = (productId: number) =>
    items.find((item) => item.product.id === productId)?.quantity ?? 0;

  const handleAddItem = (product: Product) => {
    addItem(product);
  };

  return {
    items,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
    addItem: handleAddItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
}
