import { useState } from "react";
import axios from "axios";

// Define stricter types for better type safety
interface CustomerInfo {
  fullName: string;
  email?: string;
  mobileNumber: string;
}

interface PaymentData {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  backendOrderId: string;
}

interface OrderData {
  orderId: string;
  // Add other relevant fields if needed
}

interface PaymentResponse {
  success: boolean;
  payment?: PaymentData;
  order?: OrderData;
  error?: string;
}

interface VerifyResponse {
  success: boolean;
  order: OrderData;
  notifications?: any; // Define more specific type if known
  error?: string;
}

export const usePayment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initiate payment for existing order
  const initiatePayment = async (
    orderId: string,
    paymentMethod: string,
    customerInfo: CustomerInfo,
    onSuccess: (orderDetails: OrderData, notifications?: any) => void,
    onFailure: (error: string) => void
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Create Razorpay order for existing order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, paymentMethod }),
      });

      const data: PaymentResponse = await response.json();

      console.log("Create order response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to create payment order: ${response.statusText}`
        );
      }

      const { payment, order } = data;

      // For online payments, ensure payment details exist
      if (!payment || !payment.razorpayOrderId || !payment.razorpayKeyId) {
        throw new Error("Payment details not received for online payment");
      }

      if (!order || !order.orderId) {
        throw new Error("Order details not received");
      }

      // Step 2: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      // Step 3: Configure Razorpay options
      const razorpayOptions = {
        key: payment.razorpayKeyId,
        amount: payment.amount,
        currency: payment.currency,
        name: "Cakes Wow",
        description: `Order ${order.orderId}`,
        order_id: payment.razorpayOrderId,
        prefill: {
          name: customerInfo.fullName,
          email: customerInfo.email || "",
          contact: customerInfo.mobileNumber,
        },
        theme: {
          color: "#2563eb", // Blue theme matching your app
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Step 4: Verify payment on backend
            const verifyResponse = await axios.post<VerifyResponse>(
              "/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                backend_order_id: payment.backendOrderId,
              }
            );

            if (verifyResponse.data.success) {
              console.log(
                "Payment verified successfully:",
                verifyResponse.data
              );
              onSuccess(
                verifyResponse.data.order,
                verifyResponse.data.notifications
              );
            } else {
              throw new Error(
                verifyResponse.data.error || "Payment verification failed"
              );
            }
          } catch (verifyError: any) {
            console.error("Payment verification error:", verifyError);
            const errorMessage =
              verifyError.response?.data?.error ||
              "Payment verification failed";
            setError(errorMessage);
            onFailure(errorMessage);
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed");
            const errorMessage = "Payment was cancelled";
            setError(errorMessage);
            onFailure(errorMessage);
          },
        },
      };

      // Step 5: Open Razorpay checkout
      const rzp = new (window as any).Razorpay(razorpayOptions);
      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to initiate payment";
      setError(errorMessage);
      onFailure(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
};
