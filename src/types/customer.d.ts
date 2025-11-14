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

export interface CustomerFormData {
  phone: string;
  name: string;
  dob: string;
  customerTypeId: number;
}
