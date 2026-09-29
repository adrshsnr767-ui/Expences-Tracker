import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Newsreader } from "next/font/google";
const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

const transactions = [
    { name: "Bhat Bhateni Supermarket", category: "Groceries", date: "Sep 28", amount: -1240, type: "expense" },
    { name: "Salary — Deerwalk Pvt Ltd", category: "Income", date: "Sep 27", amount: 45000, type: "income" },
    { name: "Pathao ride", category: "Transport", date: "Sep 26", amount: -320, type: "expense" },
    { name: "NEA Electricity Bill", category: "Utilities", date: "Sep 24", amount: -1450, type: "expense" },
    { name: "Cafe Soma", category: "Dining out", date: "Sep 23", amount: -680, type: "expense" },
    { name: "House rent", category: "Rent", date: "Sep 21", amount: -8000, type: "expense" },
];

export default function BalanceHero() {
    const totalSpent = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalSpent;

    return (
        <div className="border border-[#E4DFD3] p-6 md:p-8 mb-8">
            <span className="text-[#7A7266] text-xs uppercase tracking-wide">Current balance</span>
            <div className={`${newsreader.className} text-[#101B2D] text-4xl md:text-5xl mt-2`}>
                Rs {balance.toLocaleString()}
            </div>

            <div className="flex gap-8 mt-6 pt-6 border-t border-[#E4DFD3]">
                <div className="flex items-center gap-2">
                    <div className="bg-[#3F7A5C]/10 p-1.5">
                        <ArrowUpRight size={14} className="text-[#3F7A5C]" />
                    </div>
                    <div>
                        <p className="text-[#7A7266] text-xs">Income</p>
                        <p className="text-[#101B2D] text-sm font-medium">Rs {totalIncome.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-[#B34747]/10 p-1.5">
                        <ArrowDownRight size={14} className="text-[#B34747]" />
                    </div>
                    <div>
                        <p className="text-[#7A7266] text-xs">Spent</p>
                        <p className="text-[#101B2D] text-sm font-medium">Rs {totalSpent.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}