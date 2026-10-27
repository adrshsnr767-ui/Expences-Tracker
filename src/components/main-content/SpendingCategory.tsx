"use client";

import { useGetTransactionsQuery } from "@/redux/api/transactionApi";
import { useGetBudgetsQuery } from "@/redux/api/budgetApi";

const CATEGORY_COLORS: Record<string, string> = {
    Rent: "#101B2D",
    Groceries: "#B8863B",
    Transport: "#3F7A5C",
    "Dining out": "#B34747",
    Utilities: "#7A7266",
};

const normalize = (s: string) => s.trim().toLowerCase();

export default function CategoryBreakdown() {
    const {
        data: txData,
        isLoading: txLoading,
        error: txError,
    } = useGetTransactionsQuery();

    const {
        data: budgetData,
        isLoading: budgetLoading,
        error: budgetError,
    } = useGetBudgetsQuery();

    const isLoading = txLoading || budgetLoading;
    const error = txError || budgetError;

    const transactions = txData?.data ?? [];
    const budgets = budgetData?.data ?? [];

    const expenses = transactions.filter(
        (transaction) => transaction.type === "expense"
    );

    // Each category now carries its own budget AND spent
    const categories = Object.keys(CATEGORY_COLORS).map((label) => ({
        label,
        color: CATEGORY_COLORS[label],
        budget:
            budgets.find((b) => normalize(b.category) === normalize(label))
                ?.amount ?? 0,
        spent: expenses
            .filter((t) => normalize(t.category) === normalize(label))
            .reduce((sum, t) => sum + t.amount, 0),
    }));

    const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
    const totalPct =
        totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

    if (isLoading) {
        return (
            <div>
                <h2 className="text-[#101B2D] text-sm font-medium mb-4">
                    Spending by category
                </h2>

                {/* Total skeleton */}
                <div className="pb-4 mb-1 border-b border-[#D8D0C0]">
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="inline-block h-3 w-24 bg-[#E4DFD3] rounded-sm" />
                        <span className="inline-block h-3 w-28 bg-[#E4DFD3] rounded-sm" />
                    </div>
                    <div className="h-1.5 bg-[#E4DFD3] w-full overflow-hidden">
                        <div
                            className="h-1.5 cb-loading-bar"
                            style={{ backgroundColor: "#101B2D" }}
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    {categories.map((c, i) => (
                        <div
                            key={c.label}
                            className={`py-3 ${
                                i !== categories.length - 1
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
        return <p>Failed to load budget data</p>;
    }

    return (
        <div>
            <h2 className="text-[#101B2D] text-sm font-medium mb-4">
                Spending by category
            </h2>

            {/* Total budget for this month */}
            <div className="pb-4 mb-1 border-b border-[#D8D0C0]">
                <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#101B2D] font-bold">
                        Total budget
                    </span>
                    <span className="text-[#7A7266]">
                        Rs {totalSpent.toLocaleString()} /{" "}
                        {totalBudget > 0 ? totalBudget.toLocaleString() : "Not set"}
                    </span>
                </div>

                <div className="h-1.5 bg-[#E4DFD3] w-full">
                    <div
                        className="h-1.5"
                        style={{
                            width: `${totalPct}%`,
                            backgroundColor:
                                totalBudget > 0 && totalSpent > totalBudget
                                    ? "#B34747"
                                    : "#101B2D",
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                {categories.map((c, i) => {
                    const pct =
                        c.budget > 0
                            ? Math.min(100, (c.spent / c.budget) * 100)
                            : 0;

                    return (
                        <div
                            key={c.label}
                            className={`py-3 ${
                                i !== categories.length - 1
                                    ? "border-b border-[#E4DFD3]"
                                    : ""
                            }`}
                        >
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-[#101B2D]">{c.label}</span>

                                <span className="text-[#7A7266]">
                                    Rs {c.spent.toLocaleString()} /{" "}
                                    {c.budget > 0
                                        ? c.budget.toLocaleString()
                                        : "Not set"}
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