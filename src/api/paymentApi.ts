import api from "./axios";
import type { PaymentMethod, PaymentStatus } from "../types/order";

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  customerInfo?: {
    name: string;
    phoneNumber: string;
  };
  transactionDetails?: {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
  message: string;
  timestamp: string;
}

export interface PaymentMethodInfo {
  id: string;
  name: string;
  type: PaymentMethod;
  icon: string;
  isAvailable: boolean;
  processingFee?: number;
}

// Get available payment methods
// NOTE: return the API payload entries directly without modifying them.
export const getPaymentMethods = async (): Promise<unknown[]> => {
  try {
    const response = await api.get("/api/restaurant/payment_options/all", {
      params: { Status: true },
    });
    const payload = response.data;
    if (!payload || !payload.success || !Array.isArray(payload.data)) {
      throw new Error("Invalid payment options response");
    }

    // Return raw API data array as-is
    return payload.data;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    // Fallback: return a minimal API-shaped response so caller can use it directly
    return [
      {
        _id: "fallback_cash_group",
        PaymentOption: [
          { _id: "cash", option: "Cash", Details: "Pay with cash" },
        ],
        Status: true,
        Payment_Options_id: 2,
      },
    ];
  }
};

// Process payment
export const processPayment = async (): // paymentRequest: PaymentRequest
Promise<PaymentResponse> => {
  // try {
  //   console.log('Processing payment:', paymentRequest);
  //   const response = await api.post('/payment/process', paymentRequest);
  //   console.log('Payment response:', response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error processing payment:', error);
  //   // Fallback to dummy success response
  return {
    success: true,
    transactionId: `TXN_${Date.now()}`,
    status: "Paid",
    message: "Payment processed successfully",
    timestamp: new Date().toISOString(),
  };
  // }
};

// Get payment status
export const getPaymentStatus = async (
  transactionId: string
): Promise<PaymentResponse> => {
  // try {
  //   const response = await api.get(`/payment/status/${transactionId}`);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error fetching payment status:', error);
  //   // Fallback to dummy status
  return {
    success: true,
    transactionId,
    status: "Paid",
    message: "Payment completed",
    timestamp: new Date().toISOString(),
  };
  // }
};

// Refund payment
export const refundPayment = async (
  transactionId: string
  //  amount?: number
): Promise<PaymentResponse> => {
  // try {
  //   const response = await api.post(`/payment/refund/${transactionId}`, { amount });
  //   return response.data;
  // } catch (error) {
  //   console.error('Error processing refund:', error);
  //   // Fallback to dummy refund response
  return {
    success: true,
    transactionId,
    status: "Refunded",
    message: "Refund processed successfully",
    timestamp: new Date().toISOString(),
  };
  // }
};

// Get payment history
export const getPaymentHistory = async (): //   params?:
//    {
//   startDate?: string;
//   endDate?: string;
//   method?: PaymentMethod;
//   status?: PaymentStatus;
// }
Promise<PaymentResponse[]> => {
  // try {
  //   const response = await api.get('/payment/history', { params });
  //   return response.data;
  // } catch (error) {
  //   console.error('Error fetching payment history:', error);
  //   // Fallback to dummy history
  return [
    {
      success: true,
      transactionId: "TXN_001",
      status: "Paid",
      message: "Payment completed",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      success: true,
      transactionId: "TXN_002",
      status: "Refunded",
      message: "Refund processed",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
  // }
};
