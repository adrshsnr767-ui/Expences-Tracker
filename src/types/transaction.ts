export type Transaction = {
    _id: string;
    title: string;
    amount: number;
    type: "income" | "expense";
    category?: string;
    date: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
};

export type TransactionsResponse = {
    data: Transaction[];
};