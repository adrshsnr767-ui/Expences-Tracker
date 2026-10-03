import { apiSlice } from "./apiSlice";
import type { TransactionsResponse } from "@/types/transaction";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTransaction: builder.mutation({
            query: (data) => ({
                url: "/transactions",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Transactions"],
        }),

        getTransactions: builder.query<TransactionsResponse, void>({
            query: () => "/transactions",
            providesTags: ["Transactions"],
        }),
    }),
});

export const {
    useCreateTransactionMutation,
    useGetTransactionsQuery,
} = transactionApi;