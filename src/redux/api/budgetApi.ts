import { apiSlice } from "./apiSlice";
export interface SaveBudgetRequest {
    categoryId: string;
    amount: string | number;
}

export interface Budget {
    _id: string;
    user: string;
    category: string;
    amount: number;
    month: number;
    year: number;
}

export interface SaveBudgetResponse {
    message: string;
    data: Budget;
}

export const budgetApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        saveBudget: builder.mutation<SaveBudgetResponse, SaveBudgetRequest>({
            query: (body) => ({
                url: "/budget",
                method: "POST",
                body,
            }), invalidatesTags: ["Budgets"],
        }),
        getBudgets: builder.query<{ data: { category: string; amount: number }[] }, void>({
            query: () => "/budget",   
            providesTags: ["Budgets"],
        }),
    }),
});

export const { useSaveBudgetMutation, useGetBudgetsQuery } = budgetApi;