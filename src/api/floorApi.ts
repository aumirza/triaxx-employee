import api from "./axios";

interface IFloorResponse {
  success: boolean;
  message: string;
  data: FloorType[];
}

export interface FloorType {
  Floor_Type_id: {
    Floor_Type_id: number;
    Floor_Type_Name: string;
    emozi?: string;
  } | null;
  Floor_Name: string;
  Total_Table_Count?: number;
  ["Seating-Persons_Count"]?: number;
  Details?: string;
  Status?: boolean;
  CreateBy?: number | Record<string, unknown>;
  CreateAt?: string;
  UpdatedAt?: string;
  Floor_id: number;
  UpdatedBy?: number | null;
}

// Fetch all floors from backend. Falls back to a small dummy set on error.
export const getAllFloors = async () => {
  try {
    // try common admin endpoint used in request sample
    const resp = await api.get<IFloorResponse>("/api/admin/floor/getall");
    if (
      resp &&
      resp.data &&
      resp.data.success &&
      Array.isArray(resp.data.data)
    ) {
      return resp.data.data as FloorType[];
    }
    // Try more direct shape if API responds differently
    if (resp && resp.data && Array.isArray(resp.data)) {
      return resp.data as FloorType[];
    }
    return [];
  } catch (err) {
    console.error("getAllFloors failed, falling back to dummy:", err);
  }
};
