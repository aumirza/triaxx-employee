import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quickOrderApi = createApi({
    reducerPath: 'quickOrderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://vercel-mr-clement-pos-backend.vercel.app',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllItemTypes: builder.query({
            query: () => '/api/admin/items_types/getall',
        }),
        getAllItems: builder.query({
            query: () => '/api/admin/items/getall',
        }),
        getItemTypeById: builder.query({
            query: (id) => `/api/admin/items/getbyitemtype/${id}`,
            forceRefetch: () => true,

        }),
    }),
});

export const {
    useGetAllItemTypesQuery,
    useGetAllItemsQuery,
    useGetItemTypeByIdQuery,
} = quickOrderApi;