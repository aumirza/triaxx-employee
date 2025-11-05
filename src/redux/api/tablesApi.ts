import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  GetTablesByFloorResponse,
  GetTableBookingStatusesResponse,
} from "@/types/table";

export const tablesApi = createApi({
  reducerPath: "tablesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // keep same auth header convention as other api slices
      const state = getState() as { auth?: { token?: string } };
      const token = state?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTablesByFloor: builder.query<GetTablesByFloorResponse, number | string>({
      query: (floorId) =>
        `/api/master/floor_map_table/getTablebyFloorid/${floorId}`,
      // keep raw server response; components will read `data` field
    }),
    getTableBookingStatuses: builder.query<
      GetTableBookingStatusesResponse,
      void
    >({
      query: () => `/api/admin/table_booking_status/getall`,
    }),
  }),
});

export const { useGetTablesByFloorQuery, useGetTableBookingStatusesQuery } =
  tablesApi;
