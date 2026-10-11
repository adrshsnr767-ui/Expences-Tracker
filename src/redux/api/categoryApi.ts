import { apiSlice } from "./apiSlice";
import type { CategoriesResponse } from "@/types/category";

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (data) => ({
                url: "/categories",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Categories"],
        }),

        getCategories: builder.query<CategoriesResponse, void>({
            query: () => "/categories",
            providesTags: ["Categories"],
        }),
    }),
});

export const {
    useCreateCategoryMutation,
    useGetCategoriesQuery,
} = categoryApi;