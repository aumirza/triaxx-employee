import type { Order, PreparationStation, OrderItem } from "../types/order";
import api from "./axios";

// Dummy images for categories
const burgerImages = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80",
];
const beverageImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1510626176961-4b57d4fbad04?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
];
const crispyImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
];
const nuggetImages = [
  "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80",
];

const burgerNames = [
  "Spicy Burger",
  "Classic Burger",
  "Cheese Burger",
  "Veggie Burger",
  "Chicken Burger",
  "Double Patty Burger",
  "BBQ Burger",
  "Fish Burger",
  "Bacon Burger",
  "Mushroom Burger",
];
const beverageNames = [
  "Cola",
  "Lemonade",
  "Iced Tea",
  "Orange Juice",
  "Milkshake",
  "Coffee",
  "Green Tea",
  "Smoothie",
  "Water",
  "Energy Drink",
];
const crispyNames = [
  "Crispy Chicken",
  "Crispy Wings",
  "Crispy Tenders",
  "Crispy Fries",
  "Crispy Fish",
  "Crispy Onion Rings",
  "Crispy Nuggets",
  "Crispy Shrimps",
  "Crispy Calamari",
  "Crispy Potato",
];
const nuggetNames = [
  "Chicken Nuggets",
  "Fish Nuggets",
  "Veggie Nuggets",
  "Cheese Nuggets",
  "Spicy Nuggets",
  "BBQ Nuggets",
  "Mini Nuggets",
  "Crunchy Nuggets",
  "Classic Nuggets",
  "Herb Nuggets",
];

const items = [
  ...burgerNames.map((name, i) => ({
    itemId: `burger${i + 1}`,
    name,
    quantity: 1,
    price: 330 + i * 10,
    availability: true,
    itemType: "Burger",
    image: burgerImages[i % burgerImages.length],
    addOns: [],
    notes: "",
    size: "Regular",
    preparationStation: "Kitchen" as PreparationStation,
  })),
  ...beverageNames.map((name, i) => ({
    itemId: `beverage${i + 1}`,
    name,
    quantity: 1,
    price: 120 + i * 5,
    availability: true,
    itemType: "Beverage",
    image: beverageImages[i % beverageImages.length],
    addOns: [],
    notes: "",
    size: "Medium",
    preparationStation: "Counter" as PreparationStation,
  })),
  ...crispyNames.map((name, i) => ({
    itemId: `crispy${i + 1}`,
    name,
    quantity: 1,
    price: 200 + i * 8,
    availability: true,
    itemType: "Crispy",
    image: crispyImages[i % crispyImages.length],
    addOns: [],
    notes: "",
    size: "Regular",
    preparationStation: "Kitchen" as PreparationStation,
  })),
  ...nuggetNames.map((name, i) => ({
    itemId: `nugget${i + 1}`,
    name,
    quantity: 1,
    price: 150 + i * 7,
    availability: true,
    itemType: "Nugget",
    image: nuggetImages[i % nuggetImages.length],
    addOns: [],
    notes: "",
    size: "Small",
    preparationStation: "Kitchen" as PreparationStation,
  })),
];

const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();
const nineMinutesAgo = new Date(Date.now() - 9 * 60 * 1000).toISOString();
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

function calcPricingSummary(
  orderItems: { price: number; quantity?: number }[],
  taxPercentage: number = 6,
  discount: number = 0,
  discountType?: string,
  discountCode?: string,
  serviceCharge: number = 0
) {
  const subtotal = orderItems.reduce(
    (sum: number, item: { price: number; quantity?: number }) =>
      sum + item.price * (item.quantity || 1),
    0
  );
  const tax = Math.round(subtotal * (taxPercentage / 100));
  const totalAmount = subtotal + tax + serviceCharge - discount;
  console.log({
    subtotal,
    tax,
    taxPercentage,
    discount,
    discountType,
    discountCode,
    serviceCharge,
    totalAmount,
  });
  return {
    subtotal,
    tax,
    taxPercentage,
    discount,
    discountType,
    discountCode,
    serviceCharge,
    totalAmount,
  };
}

const dummyOrders: Order[] = [
  {
    orderId: "1",
    status: "Served",
    orderType: "Dine-In",
    tableInfo: { tableId: "T1", floor: "1", status: "Occupied" },
    waiterName: "John Doe",
    customerInfo: { name: "Alice", phoneNumber: "1234567890" },
    items: items.slice(0, 2),
    pricingSummary: calcPricingSummary(
      items.slice(0, 2),
      6,
      0,
      "Code",
      "DISC5",
      0
    ),
    paymentDetails: {
      method: "Cash",
      status: "Unpaid",
      transactionId: "TXN001",
      kitchenNotes: "No onions",
    },
    createdAt: twentyMinutesAgo,
    updatedAt: twentyMinutesAgo,
    statusHistory: [{ status: "Pending", at: twentyMinutesAgo }],
  },
  {
    orderId: "2",
    status: "Preparing",
    orderType: "Takeout",
    tableInfo: { tableId: "T2", floor: "1", status: "Available" },
    waiterName: "Jane Smith",
    customerInfo: { name: "Bob", phoneNumber: "9876543210" },
    items: items.slice(2, 5),
    pricingSummary: calcPricingSummary(
      items.slice(2, 5),
      6,
      0,
      undefined,
      undefined,
      0
    ),
    paymentDetails: {
      method: "Credit Card",
      status: "Paid",
      transactionId: "TXN002",
      kitchenNotes: "Extra spicy",
    },
    createdAt: twentyMinutesAgo,
    updatedAt: nineMinutesAgo,
    statusHistory: [
      { status: "Pending", at: twentyMinutesAgo },
      { status: "Preparing", at: nineMinutesAgo },
    ],
  },
  {
    orderId: "3",
    status: "Completed",
    orderType: "Delivery",
    waiterName: "Sam Wilson",
    tableInfo: { tableId: "T3", floor: "1", status: "Available" },
    customerInfo: { name: "Charlie", phoneNumber: "5551234567" },
    items: items.slice(5, 8),
    pricingSummary: calcPricingSummary(
      items.slice(5, 8),
      6,
      0,
      "Promo",
      "PROMO10",
      0
    ),
    paymentDetails: {
      method: "Online",
      status: "Paid",
      transactionId: "TXN003",
      kitchenNotes: "",
    },
    createdAt: twentyMinutesAgo,
    updatedAt: fiveMinutesAgo,
    statusHistory: [
      { status: "Pending", at: twentyMinutesAgo },
      { status: "Preparing", at: nineMinutesAgo },
      { status: "Completed", at: fiveMinutesAgo },
    ],
  },
  {
    orderId: "4",
    status: "Served",
    orderType: "Dine-In",
    tableInfo: { tableId: "T4", floor: "2", status: "Served" },
    waiterName: "Emily Clark",
    customerInfo: { name: "David", phoneNumber: "2223334444" },
    items: items.slice(8, 10),
    pricingSummary: calcPricingSummary(
      items.slice(8, 10),
      6,
      0,
      undefined,
      undefined,
      0
    ),
    paymentDetails: {
      method: "Cash",
      status: "Unpaid",
      transactionId: "TXN004",
      kitchenNotes: "No cheese",
    },
    createdAt: nineMinutesAgo,
    updatedAt: fiveMinutesAgo,
    statusHistory: [
      { status: "Pending", at: nineMinutesAgo },
      { status: "Served", at: fiveMinutesAgo },
    ],
  },
  {
    orderId: "5",
    status: "Preparing",
    orderType: "Dine-In",
    tableInfo: { tableId: "T5", floor: "2", status: "Reserved" },
    waiterName: "Olivia Brown",
    customerInfo: { name: "Eve", phoneNumber: "3334445555" },
    items: items.slice(10, 13),
    pricingSummary: calcPricingSummary(
      items.slice(10, 13),
      6,
      0,
      undefined,
      undefined,
      0
    ),
    paymentDetails: {
      method: "Credit Card",
      status: "Paid",
      transactionId: "TXN005",
      kitchenNotes: "Extra sauce",
    },
    createdAt: fiveMinutesAgo,
    updatedAt: fiveMinutesAgo,
    statusHistory: [{ status: "Pending", at: fiveMinutesAgo }],
  },
  // Additional dummy orders for ids 6-9
  {
    orderId: "6",
    status: "Ready",
    orderType: "Dine-In",
    tableInfo: { tableId: "T6", floor: "2", status: "Ready" },
    waiterName: "Liam Green",
    customerInfo: { name: "Frank", phoneNumber: "4445556666" },
    items: items.slice(13, 15),
    pricingSummary: calcPricingSummary(
      items.slice(13, 15),
      6,
      0,
      undefined,
      undefined,
      0
    ),
    paymentDetails: {
      method: "Cash",
      status: "Unpaid",
      transactionId: "TXN006",
      kitchenNotes: "No pickles",
    },
    createdAt: fiveMinutesAgo,
    updatedAt: fiveMinutesAgo,
    statusHistory: [
      { status: "Pending", at: fiveMinutesAgo },
      { status: "Ready", at: fiveMinutesAgo },
    ],
  },
  {
    orderId: "7",
    status: "Preparing",
    orderType: "Dine-In",
    tableInfo: { tableId: "T7", floor: "2", status: "Waiting" },
    waiterName: "Sophia White",
    customerInfo: { name: "Grace", phoneNumber: "5556667777" },
    items: items.slice(15, 18),
    pricingSummary: calcPricingSummary(
      items.slice(15, 18),
      6,
      0,
      undefined,
      undefined,
      0
    ),
    paymentDetails: {
      method: "Credit Card",
      status: "Paid",
      transactionId: "TXN007",
      kitchenNotes: "No salt",
    },
    createdAt: fiveMinutesAgo,
    updatedAt: fiveMinutesAgo,
    statusHistory: [{ status: "Pending", at: fiveMinutesAgo }],
  },
  {
    orderId: "8",
    status: "Preparing",
    orderType: "Dine-In",
    tableInfo: { tableId: "T8", floor: "3", status: "Occupied" },
    waiterName: "Noah Black",
    customerInfo: { name: "Henry", phoneNumber: "6667778888" },
    items: items.slice(18, 21),
    pricingSummary: calcPricingSummary(
      items.slice(18, 21),
      6,
      0,
      undefined,
      undefined,
      0
    ),
    paymentDetails: {
      method: "Cash",
      status: "Unpaid",
      transactionId: "TXN008",
      kitchenNotes: "No lettuce",
    },
    createdAt: fiveMinutesAgo,
    updatedAt: fiveMinutesAgo,
    statusHistory: [
      { status: "Pending", at: fiveMinutesAgo },
      { status: "Preparing", at: fiveMinutesAgo },
    ],
  },
  {
    orderId: "9",
    status: "Served",
    orderType: "Dine-In",
    tableInfo: { tableId: "T9", floor: "3", status: "Served" },
    waiterName: "Mia Blue",
    customerInfo: { name: "Ivy", phoneNumber: "7778889999" },
    items: items.slice(21, 24),
    pricingSummary: calcPricingSummary(
      items.slice(21, 24),
      6,
      0,
      undefined,
      undefined,
      0
    ),
    paymentDetails: {
      method: "Credit Card",
      status: "Paid",
      transactionId: "TXN009",
      kitchenNotes: "No tomato",
    },
    createdAt: fiveMinutesAgo,
    updatedAt: fiveMinutesAgo,
    statusHistory: [
      { status: "Pending", at: fiveMinutesAgo },
      { status: "Served", at: fiveMinutesAgo },
    ],
  },
];

export const fetchOrders = async (params?: {
  status?: string;
  dateRange?: string;
}): Promise<Order[]> => {
  // try {
  //   console.log('Fetching orders with params:', params);
  //   const response = await api.get('/orders', { params });
  //   console.log('API response:', response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error fetching orders:', error);
  //   // Fallback to dummy data if API fails
  let filtered = dummyOrders;
  if (params?.status && params.status !== "All Tables") {
    filtered = filtered.filter((o) => o.status === params.status);
  }
  // Add date filtering logic
  if (params?.dateRange) {
    filtered = filterOrdersByDate(filtered, params.dateRange);
  }
  return filtered;
  // }
};

// POS Order Creation Types
export interface POSOrderItem {
  item_id: number;
  item_Quentry: number;
  item_Addons_id?: number;
  item_Variants_id?: number;
}

export interface POSOrderRequest {
  items: POSOrderItem[];
  Tax: number;
  Customer_id: number;
  Dining_Option: string;
  Table_id: number;
  Kitchen_id?: number;
  Status?: boolean;
}

export interface POSOrderResponse {
  success: boolean;
  message: string;
  data: {
    Order_id: number;
    Customer_id: number;
    Table_id: number;
    Dining_Option: string;
    Tax: number;
    Kitchen_id: number;
    Status: boolean;
    CreateBy: number;
    _id: string;
    CreateAt: string;
    UpdatedAt: string;
    items?: POSOrderItem[];
  };
}

// Create POS Order using the correct API endpoint
export const createPOSOrder = async (
  orderData: POSOrderRequest
): Promise<POSOrderResponse> => {
  try {
    console.log("Creating POS order:", orderData);
    const response = await api.post<POSOrderResponse>(
      "/api/restaurant/pos_order/create",
      orderData
    );
    console.log("Create POS order response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating POS order:", error);
    throw error;
  }
};

export const createOrder = async (
  order: Order
): Promise<{ success: boolean; order: Order }> => {
  // try {
  //   console.log('Creating order:', order);
  //   const response = await api.post('/orders', order);
  //   console.log('Create order response:', response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error creating order:', error);
  //   // Fallback to dummy success
  return { success: true, order: { ...order, orderId: `ORDER_${Date.now()}` } };
  // }
};

export const updateOrder = async (
  orderId: string,
  updates: Partial<Order>
): Promise<{ success: boolean; orderId: string; updates: Partial<Order> }> => {
  // try {
  //   console.log('Updating order:', orderId, updates);
  //   const response = await api.patch(`/orders/${orderId}`, updates);
  //   console.log('Update order response:', response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error updating order:', error);
  //   // Fallback to dummy success
  return { success: true, orderId, updates };
  // }
};

export const getOrderById = async (
  orderId: string
): Promise<Order | undefined> => {
  console.log(orderId, "orderId");
  // try {
  //   const response = await api.get(`/orders/${orderId}`);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error fetching order by ID:', error);
  //   // Fallback to dummy data
  return dummyOrders.find((order) => order.orderId === orderId);
  // }
};

export const deleteOrder = async (
  orderId: string
): Promise<{ success: boolean; orderId: string }> => {
  return Promise.resolve({ success: true, orderId });
};

// New functions for enhanced order management

// Get orders by status
export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  // try {
  //   const response = await api.get(`/orders/status/${status}`);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error fetching orders by status:', error);
  //   // Fallback to dummy data
  return dummyOrders.filter((order) => order.status === status);
  // }
};

// Get orders by table
export const getOrdersByTable = async (tableId: string): Promise<Order[]> => {
  //   try {
  //     const response = await api.get(`/orders/table/${tableId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching orders by table:', error);
  //     // Fallback to dummy data
  return dummyOrders.filter((order) => order.tableInfo?.tableId === tableId);
  // }
};

// Get orders by waiter
export const getOrdersByWaiter = async (
  waiterName: string
): Promise<Order[]> => {
  // try {
  //   const response = await api.get(`/orders/waiter/${waiterName}`);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error fetching orders by waiter:', error);
  //   // Fallback to dummy data
  return dummyOrders.filter((order) => order.waiterName === waiterName);
  // }
};

// Get order statistics
export const getOrderStatistics = async (params?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}): Promise<{
  total: number;
  pending: number;
  preparing: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}> => {
  try {
    const response = await api.get("/orders/statistics", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    // Fallback to dummy statistics
    const orders = dummyOrders;
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const preparing = orders.filter((o) => o.status === "Preparing").length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.pricingSummary?.totalAmount || 0),
      0
    );
    const averageOrderValue = total > 0 ? totalRevenue / total : 0;

    return {
      total,
      pending,
      preparing,
      completed,
      cancelled,
      totalRevenue,
      averageOrderValue,
    };
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<{ success: boolean; order: Order }> => {
  // try {
  //   const response = await api.patch(`/orders/${orderId}/status`, { status });
  //   return response.data;
  // } catch (error) {
  //   console.error('Error updating order status:', error);
  //   // Fallback to dummy success
  const order = dummyOrders.find((o) => o.orderId === orderId);
  if (order) {
    order.status = status as
      | "Pending"
      | "Confirmed"
      | "Preparing"
      | "Ready"
      | "Completed"
      | "Cancelled";
  }
  return { success: true, order: order! };
  // }
};

// Add item to order
export const addItemToOrder = async (
  orderId: string,
  item: OrderItem
): Promise<{ success: boolean; order: Order }> => {
  // try {
  //   const response = await api.post(`/orders/${orderId}/items`, item);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error adding item to order:', error);
  //   // Fallback to dummy success
  const order = dummyOrders.find((o) => o.orderId === orderId);
  if (order) {
    order.items.push(item);
  }
  return { success: true, order: order! };
  // }
};

// Remove item from order
export const removeItemFromOrder = async (
  orderId: string,
  itemId: string
): Promise<{ success: boolean; order: Order }> => {
  // try {
  //   const response = await api.delete(`/orders/${orderId}/items/${itemId}`);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error removing item from order:', error);
  //   // Fallback to dummy success
  const order = dummyOrders.find((o) => o.orderId === orderId);
  if (order) {
    order.items = order.items.filter((item) => item.itemId !== itemId);
  }
  return { success: true, order: order! };
  // }
};

// Helper function to filter orders by date
const filterOrdersByDate = (orders: Order[], dateRange: string): Order[] => {
  switch (dateRange) {
    case "Today":
      return orders.slice(0, 3); // Return first 3 orders for today
    case "Yesterday":
      return orders.slice(1, 4); // Return orders 1-3 for yesterday
    case "This week":
      return orders; // Return all orders for this week
    case "This Month":
      return orders; // Return all orders for this month
    default:
      return orders;
  }
};
