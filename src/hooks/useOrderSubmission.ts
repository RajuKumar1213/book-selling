import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

// Define types for type safety
interface OrderData {
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    selectedWeight?: string;
    customization?: { type: string };
  }>;
  customerInfo: {
    fullName: string;
    mobileNumber: string;
    email?: string;
    deliveryDate: string;
    timeSlot: string;
    area: string;
  };
  totalAmount: number;
  notes?: string;
}

interface OrderResponse {
  success: boolean;
  orderId: string;
  error?: string;
}

export function useOrderSubmission() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { clearCart } = useCart();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const submitOrder = useCallback(
    async (orderData: OrderData): Promise<OrderResponse> => {
      setIsSubmitting(true);

      try {
        // Validate orderData
        if (
          !orderData.items.length ||
          !orderData.customerInfo.fullName ||
          !orderData.customerInfo.mobileNumber
        ) {
          throw new Error(
            "Invalid order data: items or customer information missing"
          );
        }

        // Set timeout for API call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        // Prefetch order confirmation page
        router.prefetch(
          `/order-confirmation/${orderData.customerInfo.mobileNumber}`
        );

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to place order: ${response.statusText}`);
        }

        const result: OrderResponse = await response.json();

        if (!result.success || !result.orderId) {
          throw new Error(result.error || "Invalid order response from server");
        }

        // Clear cart and show success toast
        clearCart();
        showSuccess(
          "Order Placed Successfully!",
          "Your order has been placed and will be delivered on time."
        );

        // Redirect with fallback
        const redirectTimeout = setTimeout(() => {
          if (!window.location.pathname.includes("/order-confirmation")) {
            console.warn(
              "Client-side navigation timed out, falling back to full redirect"
            );
            window.location.href = `/order-confirmation/${result.orderId}`;
          }
        }, 1000); // 1s timeout for client-side navigation

        router.push(`/order-confirmation/${result.orderId}`, {
          scroll: false,
        });

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to place order";
        console.error("Order placement error:", errorMessage);
        showError(errorMessage, "Order Error");
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [clearCart, showSuccess, showError, router]
  );

  return { submitOrder, isSubmitting };
}
