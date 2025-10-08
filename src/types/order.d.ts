export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled'|'Served';
export type OrderType = 'Dine-In' | 'Takeout' | 'Delivery';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Online' | 'Other';
export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded';
export type PreparationStation = 'Kitchen' | 'Bar' | 'Counter';

export interface TableInfo {
  tableId: string;
  floor: string;
  status: string;
}

export interface CustomerInfo {
  name: string;
  phoneNumber: string;
}

export interface PricingSummary {
  subtotal: number;
  tax: number;
  taxPercentage?: number;
  discount: number;
  discountType?: string;
  discountCode?: string;
  serviceCharge: number;
  totalAmount: number;
}

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  kitchenNotes?: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  description?:string;
  price: number;
  availability: boolean;
  itemType: string;
  image?: string;
  addOns?: AddOn[];
  notes?: string;
  size?: string;
  preparationStation: PreparationStation;
  allergy?: boolean;
}

export type OrderStatusHistory = {
  status: OrderStatus;
  at: string; // ISO string
};

export interface Order {
  orderId: string;
  status: OrderStatus;
  orderType: OrderType;
  tableInfo?: TableInfo;
  waiterName: string;
  customerInfo?: CustomerInfo;
  pricingSummary: PricingSummary;
  paymentDetails: PaymentDetails;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistory[];
}
