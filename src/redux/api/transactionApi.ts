import { apiSlice } from "./apiSlice";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTransaction: builder.mutation({
            query: (data) => ({
                url: "/transactions",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useCreateTransactionMutation,
} = transactionApi;