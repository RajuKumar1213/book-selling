import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useCheckout } from "@/contexts/CheckoutContext";
import { usePayment } from "@/hooks/usePayment";
import { formatPrice } from "@/utils/calculations";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { PaymentError } from "./PaymentError";

// Define types for better type safety
interface Order {
  _id: string;
  orderId: string;
  totalAmount: number;
  subtotal: number;
  deliveryCharge: number;
  customerInfo: {
    fullName: string;
    mobileNumber: string;
    deliveryDate: string;
    timeSlot: string;
    area: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    selectedWeight?: string;
    customization?: { type: string };
  }>;
}

export const PaymentStep: React.FC = () => {
  const { clearCart } = useCart();
  const { goToPreviousStep } = useCheckout();
  const { initiatePayment, loading } = usePayment();
  const router = useRouter();
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("online");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaymentError, setShowPaymentError] = useState<boolean>(false);
  const [fetchingOrder, setFetchingOrder] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [fetchRetries, setFetchRetries] = useState<number>(0); // NEW: Track retries\
  const [showLoading, setShowLoading] = useState<boolean>(false);

  // Fetch order data with timeout and improved error handling
  const fetchOrderData = useCallback(
    async (orderId: string): Promise<boolean> => {
      try {
        setFetchingOrder(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // INCREASED: Timeout to 10s for reliability

        const response = await fetch(`/api/orders/${orderId}`, {
          cache: "no-store",
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch order: ${response.status} - ${response.statusText}`
          );
        }

        const result = await response.json();
        if (
          result.success &&
          result.order &&
          result.order._id &&
          result.order.totalAmount
        ) {
          // IMPROVED: Stricter validation
          setPendingOrder(result.order);
          localStorage.setItem("pending-order", JSON.stringify(result.order)); // Update localStorage with fresh data
          return true;
        }
        console.error("Invalid order data in API response:", result);
        return false;
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.error("Fetch timed out for order:", orderId);
        } else {
          console.error("Error fetching order data:", error.message);
        }
        return false;
      } finally {
        setFetchingOrder(false);
      }
    },
    []
  );

  // Load pending order: Use local for initial set, but ALWAYS fetch/validate from server
  useEffect(() => {
    let isMounted = true; // NEW: Limit retries to avoid infinite loops

    const loadPendingOrder = async () => {
      if (typeof window === "undefined") return false;

      try {
        const savedOrderStr = localStorage.getItem("pending-order");
        const orderId =
          localStorage.getItem("current-order-id") ||
          (savedOrderStr ? JSON.parse(savedOrderStr)?.orderId : null);

        if (!orderId) {
          console.error("No order ID found in localStorage");
          return false;
        }

        // Set initial from localStorage if available (for quick UI render)
        if (savedOrderStr) {
          const order: Order = JSON.parse(savedOrderStr);
          if (
            order.totalAmount &&
            order.customerInfo &&
            order.items &&
            order.orderId === orderId
          ) {
            // IMPROVED: Check _id match
            if (isMounted) setPendingOrder(order); // Temporary set for loading UI
          }
        }

        // ALWAYS fetch from server to validate/update
        const success = await fetchOrderData(orderId);
        if (success) {
          setFetchRetries(0); // Reset retries on success
          return true;
        } else {
          // Clear invalid localStorage if fetch fails
          localStorage.removeItem("pending-order");
          return false;
        }
      } catch (error) {
        console.error("Error loading pending order:", error);
        return false;
      }
    };

    // Initial load
    loadPendingOrder().then((success) => {
      if (!isMounted) return;
      if (!success && fetchRetries < 3) {
        const delay = 2000 * Math.pow(2, fetchRetries); // 2s, 4s, 8s
        setFetchRetries((prev) => prev + 1);
        setTimeout(() => {
          if (isMounted) loadPendingOrder();
        }, delay);
      } else if (!success) {
        console.error("No pending order found after max retries");
        setPaymentError(
          "Unable to fetch order details. Please try again or contact support."
        );
        setShowPaymentError(true);
        // Optionally goToPreviousStep() here if you want to force back
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchOrderData, fetchRetries]);

  // Optimized payment handler: Add pre-payment validation
  const handlePayment = useCallback(async () => {
    if (!pendingOrder || !pendingOrder._id) {
      setPaymentError("No valid pending order found");
      setShowPaymentError(true);
      return;
    }

    // NEW: Quick re-fetch before payment to ensure order is still valid on server
    const isValid = await fetchOrderData(pendingOrder.orderId);
    if (!isValid) {
      setPaymentError(
        "Order details could not be verified. Please refresh or go back."
      );
      setShowPaymentError(true);
      return;
    }

    try {
      setIsRedirecting(true);
      router.prefetch(`/order-confirmation/${pendingOrder.orderId}`);

      await initiatePayment(
        pendingOrder.orderId,
        selectedPaymentMethod,
        pendingOrder.customerInfo,
        (orderDetails) => {
          // Batch localStorage cleanup
          const keysToRemove = [
            "pending-order",
            "current-order-id", // NEW: Also clear order ID
            "bakingo-selected-addons",
            "bakingo-addon-quantities",
            "bakingo-cart",
            "bakingo-wishlist",
            ...Object.keys(localStorage).filter(
              (key) => key.startsWith("checkout-") || key.startsWith("order-")
            ),
          ];
          keysToRemove.forEach((key) => localStorage.removeItem(key));
          clearCart();

          setShowLoading(true);

          router.push(`/order-confirmation/${orderDetails.orderId}`, {
            scroll: false,
          });
        },
        (error) => {
          throw new Error(error);
        }
      );
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentError(String(error));
      setShowPaymentError(true);
    } finally {
      setIsRedirecting(false);
      setShowLoading(false);
    }
  }, [pendingOrder, initiatePayment, clearCart, router, fetchOrderData]); // ADDED: fetchOrderData to deps

  const handleRetryPayment = () => {
    setShowPaymentError(false);
    setPaymentError(null);
    setFetchRetries(0); // NEW: Reset retries for fresh attempt
  };

  const handleBackToCheckout = () => {
    setShowPaymentError(false);
    setPaymentError(null);
    goToPreviousStep();
  };

  if (showLoading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/50 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <div className="text-white text-lg">
          Redirecting to order confirmation...
        </div>
      </div>
    );
  }

  if (fetchingOrder) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p>Fetching order details...</p>
      </div>
    );
  }

  if (!pendingOrder) {
    // NEW: Fallback if no order after all attempts
    return (
      <div className="p-6 text-center text-red-600">
        <p>Order details could not be loaded. Please go back and try again.</p>
        <button
          onClick={goToPreviousStep}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
        >
          Back to Checkout
        </button>
      </div>
    );
  }

  const finalAmount = pendingOrder.totalAmount || 0;
  const itemsTotal = pendingOrder.subtotal || pendingOrder.totalAmount || 0;
  const deliveryCharge = pendingOrder.deliveryCharge || 0;

  return (
    <div className="p-3 md:p-6">
      {/* Rest of the JSX remains unchanged */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">
          Payment
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Choose your payment method and complete your order
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4">
              Payment Method
            </h3>
            <div className="space-y-2 md:space-y-3">
              <label className="flex items-center p-3 md:p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={selectedPaymentMethod === "online"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mr-3 md:mr-4"
                />
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2 md:mr-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm md:text-base">
                    Online Payment
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    UPI, Card, Net Banking
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-medium">
                  {pendingOrder.orderId || "N/A"}
                </span>
              </div>
              {pendingOrder.items && pendingOrder.items.length > 0 && (
                <div>
                  <div className="font-medium text-gray-900 mb-2">
                    Items ({pendingOrder.items.length}):
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {pendingOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="truncate mr-2">
                          {item.quantity}x {item.name}
                          {item.selectedWeight && ` (${item.selectedWeight})`}
                          {item.customization?.type === "photo-cake" && " 📸"}
                        </span>
                        <span className="whitespace-nowrap">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {itemsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>{formatPrice(itemsTotal)}</span>
                </div>
              )}
              {deliveryCharge > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{formatPrice(deliveryCharge)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-pink-600">
                  {formatPrice(finalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 md:p-4 h-fit">
          <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4">
            Order Details
          </h3>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-medium">
                {pendingOrder.customerInfo?.fullName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Mobile:</span>
              <span>{pendingOrder.customerInfo?.mobileNumber || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Date:</span>
              <span>
                {pendingOrder.customerInfo?.deliveryDate
                  ? new Date(
                      pendingOrder.customerInfo.deliveryDate
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time Slot:</span>
              <span>{pendingOrder.customerInfo?.timeSlot || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Area:</span>
              <span>{pendingOrder.customerInfo?.area || "N/A"}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-pink-200">
            <div className="text-xs md:text-sm text-gray-600 mb-1">
              Amount to Pay:
            </div>
            <div className="text-lg md:text-xl font-bold text-pink-600">
              {formatPrice(finalAmount)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <button
          onClick={goToPreviousStep}
          disabled={isRedirecting || loading}
          className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          <span>Back to Cart Review</span>
        </button>
        <button
          onClick={handlePayment}
          disabled={loading || isRedirecting}
          className="px-6 md:px-8 py-2 md:py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium text-sm md:text-base w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || isRedirecting ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {showPaymentError && paymentError && (
        <PaymentError
          error={paymentError}
          onRetry={handleRetryPayment}
          onBack={handleBackToCheckout}
        />
      )}
    </div>
  );
};
