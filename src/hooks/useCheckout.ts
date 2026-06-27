"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/useUser";
import { checkoutSchema, type CheckoutFormData } from "@/utils/validation";
import { sendOrderConfirmationEmail } from "@/lib/emailjs";
import { formatCurrency, truncateId } from "@/utils/format";

export function useCheckout() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile, isLoading: isUserLoading } = useUser();
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const shippingCost = totalPrice >= 50 ? 0 : 4.99;
  const grandTotal = parseFloat((totalPrice + shippingCost).toFixed(2));

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  // Auto-fill form once user data has loaded
  useEffect(() => {
    if (isUserLoading) return;

    form.reset({
      full_name: profile?.full_name ?? "",
      email: user?.email ?? "",
      phone: profile?.phone ?? "",
      address: profile?.address ?? "",
      city: "",
      state: "",
      zip_code: "",
    });
  }, [isUserLoading, user, profile, form]);

  const handlePaymentSuccess = async (reference: string) => {
    setIsSavingOrder(true);

    try {
      const supabase = createClient();
      const formData = form.getValues();
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip_code}`;

      // 1. Save the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          status: "processing",
          total_amount: grandTotal,
          payment_reference: reference,
          payment_status: "paid",
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Save order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_title: item.product.title,
        product_image: item.product.thumbnail,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Build readable items summary for the email
      const itemsSummary = items
        .map(
          (item) =>
            `${item.product.title} x${item.quantity} — ${formatCurrency(
              item.unitPrice * item.quantity,
            )}`,
        )
        .join("\n");

      // 4. Send order confirmation email
      await sendOrderConfirmationEmail({
        to_name: formData.full_name,
        to_email: formData.email,
        order_id: truncateId(order.id),
        order_total: formatCurrency(grandTotal),
        order_items: itemsSummary,
        shipping_address: shippingAddress,
      });

      // 5. Clear cart and redirect
      clearCart();
      toast.success("Order placed! Confirmation email sent.");
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Payment received but order save failed. Contact support.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handlePaymentClose = () => {
    toast("Payment cancelled. Your cart is still saved.", { icon: "ℹ️" });
  };

  return {
    form,
    items,
    totalPrice,
    shippingCost,
    grandTotal,
    user,
    isUserLoading,
    isSavingOrder,
    handlePaymentSuccess,
    handlePaymentClose,
  };
}
