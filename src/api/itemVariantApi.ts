import api from "./axios";

export type ItemVariant = {
  item_Variants_id?: number;
  Variants: string;
  prices?: number;
  item_map_Variants_id?: number;
};

export type ItemWithVariants = {
  _id?: string;
  Items_types_id?: number;
  Emozi?: string;
  image?: string;
  "item-name"?: string;
  "item-code"?: string;
  "item-size"?: string;
  "item-price"?: number;
  "item-quantity"?: number;
  "item-stock-quantity"?: number;
  Details?: string;
  Status?: boolean;
  CreateBy?: number;
  CreateAt?: string;
  UpdatedAt?: string;
  Items_id?: number;
  Variants?: ItemVariant[];
};

export interface GetItemWithVariantsResponse {
  success: boolean;
  message: string;
  data: ItemWithVariants;
}

/**
 * Get item with mapped variants by item id
 * @param itemId - numeric or string id for the item (Items_id)
 */
export const getItemWithVariants = async (
  itemId: number | string
): Promise<ItemWithVariants | null> => {
  try {
    const path = `/api/restaurant/item_map_variants/getbyitemwithVariants/${itemId}`;
    const res = await api.get<GetItemWithVariantsResponse>(path);
    if (res?.data?.success && res.data.data) return res.data.data;
    return null;
  } catch (error) {
    console.error("Error fetching item variants:", error);
    throw error;
  }
};
