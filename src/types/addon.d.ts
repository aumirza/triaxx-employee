export interface ItemAddonCreator {
  user_id: number;
  Name: string;
  email: string;
}

export interface ItemAddon {
  prices: number;
  _id: string;
  Addons: string; // name of addon
  Status: boolean;
  CreateBy?: ItemAddonCreator | null;
  CreateAt?: string | null;
  UpdatedAt?: string | null;
  item_Addons_id?: number;
  UpdatedBy?: ItemAddonCreator | null;
}

export interface ItemAddonsApiResponse {
  success: boolean;
  count: number;
  data: ItemAddon[];
}
