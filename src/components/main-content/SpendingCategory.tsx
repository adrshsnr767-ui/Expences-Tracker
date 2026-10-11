"use client";

import { useGetTransactionsQuery } from "@/redux/api/transactionApi";

export default function CategoryBreakdown() {
    const categories = [
        {
            label: "Rent",
            budget: 8000,
            color: "#101B2D",
        },
        {
            label: "Groceries",
            budget: 5000,
            color: "#B8863B",
        },
        {
            label: "Transport",
            budget: 2500,
            color: "#3F7A5C",
        },
        {
            label: "Dining out",
            budget: 2000,
            color: "#B34747",
        },
        {
            label: "Utilities",
            budget: 1500,
            color: "#7A7266",
        },
    ];

    const { data, isLoading, error } = useGetTransactionsQuery();

    const transactions = data?.data ?? [];

    const expenses = transactions.filter(
        (transaction) => transaction.type === "expense"
    );
    if (isLoading) {
        return (
            <div>
                <h2 className="text-[#101B2D] text-sm font-medium mb-4">
                    Spending by category
                </h2>

                <div className="flex flex-col">
                    {categories.map((c, i) => (
                        <div
                            key={c.label}
                            className={`py-3 ${i !== categories.length - 1
                                ? "border-b border-[#E4DFD3]"
                                : ""
                                }`}
                        >
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="inline-block h-3 w-16 bg-[#E4DFD3] rounded-sm" />
                                <span className="inline-block h-3 w-20 bg-[#E4DFD3] rounded-sm" />
                            </div>

                            <div className="h-1 bg-[#E4DFD3] w-full overflow-hidden">
                                <div
                                    className="h-1 cb-loading-bar"
                                    style={{
                                        backgroundColor: c.color,
                                        animationDelay: `${i * 0.15}s`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                
                <style>{`
                .cb-loading-bar {
                    width: 0%;
                    animation: cb-loading-bar-grow 1.4s ease-in-out infinite;
                }
                @keyframes cb-loading-bar-grow {
                    0% { width: 0%; }
                    60% { width: 75%; }
                    100% { width: 0%; }
                }
            `}</style>
            </div>
        );
    }

    if (error) {
        return <p>Failed to load expenses</p>;
    }

    return (
        <div>
            <h2 className="text-[#101B2D] text-sm font-medium mb-4">
                Spending by category
            </h2>

            <div className="flex flex-col">
                {categories.map((c, i) => {
                    const spent = expenses
                        .filter(
                            (transaction) =>
                                transaction.category === c.label
                        )
                        .reduce(
                            (sum, transaction) =>
                                sum + transaction.amount,
                            0
                        );

                    const pct = Math.min(
                        100,
                        (spent / c.budget) * 100
                    );

                    return (
                        <div
                            key={c.label}
                            className={`py-3 ${i !== categories.length - 1
                                ? "border-b border-[#E4DFD3]"
                                : ""
                                }`}
                        >
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-[#101B2D]">
                                    {c.label}
                                </span>

                                <span className="text-[#7A7266]">
                                    Rs {spent.toLocaleString()} /{" "}
                                    {c.budget.toLocaleString()}
                                </span>
                            </div>

                            <div className="h-1 bg-[#E4DFD3] w-full">
                                <div
                                    className="h-1"
                                    style={{
                                        width: `${pct}%`,
                                        backgroundColor: c.color,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}