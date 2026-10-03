"use client";

import { useGetTransactionsQuery } from "@/redux/api/transactionApi";
import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function WeeklySpend() {
    const { data, isLoading, error } = useGetTransactionsQuery();

    const transactions = data?.data ?? [];

    // Only expenses
    const expenses = transactions.filter(
        (transaction) => transaction.type === "expense"
    );

    // Find start of current week (Monday)
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(today.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Find end of current week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Expenses inside current week
    const weeklyExpenses = expenses.filter((transaction) => {
        const transactionDate = new Date(transaction.date);

        return (
            transactionDate >= startOfWeek &&
            transactionDate <= endOfWeek
        );
    });

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Total expense for each day
    const weeklySpend = days.map((day, index) => {
        const total = weeklyExpenses
            .filter((transaction) => {
                const transactionDate = new Date(transaction.date);
                const dayIndex = transactionDate.getDay();
                const mondayIndex = dayIndex === 0 ? 6 : dayIndex - 1;

                return mondayIndex === index;
            })
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        return {
            day,
            amt: total,
        };
    });

    if (isLoading) {
        return (
            <div className="border border-[#E4DFD3] p-6 mb-8">
                <span className="text-[#7A7266] text-xs uppercase tracking-wide">
                    This week
                </span>

                <p className="text-sm text-[#7A7266] mt-5">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border border-[#E4DFD3] p-6 mb-8">
                <span className="text-[#7A7266] text-xs uppercase tracking-wide">
                    This week
                </span>

                <p className="text-sm text-red-500 mt-5">
                    Failed to load expenses
                </p>
            </div>
        );
    }

    return (
        <div className="border border-[#E4DFD3] p-6 mb-8">
            <span className="text-[#7A7266] text-xs uppercase tracking-wide">
                This week
            </span>

            <div className="mt-5 h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={weeklySpend}
                        margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#7A7266", fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value) => [`Rs ${value}`, "Spent"]}
                            contentStyle={{
                                border: "1px solid #E4DFD3",
                                borderRadius: 0,
                                background: "#FAF7F2",
                                fontSize: 12,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="amt"
                            stroke="#101B2D"
                            strokeWidth={3}
                            dot={{ r: 5, fill: "#101B2D" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}