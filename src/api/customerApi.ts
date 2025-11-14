import api from "./axios";

export interface Customer {
  Customer_id?: number;
  phone: string;
  Name: string;
  DOB: string;
  Customer_type_id: number;
  Table_id: number;
  Status?: boolean;
  CreateBy?: number;
  _id?: string;
  CreateAt?: string;
  UpdatedAt?: string;
}

export interface CreateCustomerRequest {
  phone: string;
  Name: string;
  DOB: string;
  Customer_type_id: number;
  Table_id: number;
}

export interface CreateCustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

/**
 * Create a new customer
 * @param customerData - Customer data to create
 * @returns Promise with the created customer data
 */
export const createCustomer = async (
  customerData: CreateCustomerRequest
): Promise<CreateCustomerResponse> => {
  try {
    const response = await api.post<CreateCustomerResponse>(
      "/api/restaurant/customer/create",
      customerData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

/**
 * Get customer by ID
 * @param customerId - Customer ID
 * @returns Promise with the customer data
 */
export const getCustomerById = async (
  customerId: number
): Promise<Customer> => {
  try {
    const response = await api.get<{ success: boolean; data: Customer }>(
      `/api/restaurant/customer/${customerId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};
