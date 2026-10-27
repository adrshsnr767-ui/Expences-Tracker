import { Newsreader } from "next/font/google";
import Link from "next/link";

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

type Transaction = {
    id: string;
    name: string;
    category: string;
    date: string;
    type: "income" | "expense";
    amount: number;
};

// Static placeholder data
const transactions: Transaction[] = [
    { id: "1", name: "Momo at Newa Cafe", category: "Dining out", date: "Oct 27, 2026", type: "expense", amount: 450 },
    { id: "2", name: "Monthly salary", category: "Salary", date: "Oct 25, 2026", type: "income", amount: 45000 },
    { id: "3", name: "Vegetables and rice", category: "Groceries", date: "Oct 24, 2026", type: "expense", amount: 1850 },
    { id: "4", name: "Electricity bill", category: "Utilities", date: "Oct 22, 2026", type: "expense", amount: 1200 },
    { id: "5", name: "Pathao ride", category: "Transport", date: "Oct 20, 2026", type: "expense", amount: 320 },
    { id: "6", name: "Freelance project", category: "Freelance", date: "Oct 18, 2026", type: "income", amount: 8000 },
    { id: "7", name: "October rent", category: "Rent", date: "Oct 15, 2026", type: "expense", amount: 8000 },
    { id: "8", name: "Internet bill", category: "Utilities", date: "Oct 12, 2026", type: "expense", amount: 900 },
];

const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

const summary = [
    { label: "Income", value: income, color: "text-[#3F7A5C]" },
    { label: "Expenses", value: expenses, color: "text-[#B34747]" },
    { label: "Balance", value: income - expenses, color: "text-[#101B2D]" },
];

export default function TransactionsPage() {
    return (
        <>
            <div className="mb-10">
                {/* Back link */}
                <Link
                    href="/dashboard"
                    className="text-[#7A7266] text-sm hover:text-[#101B2D] transition-colors"
                >
                    ← Back to dashboard
                </Link>
                <h1 className={`${newsreader.className} text-[#101B2D] text-4xl font-medium mt-0.5`}>
                    Transactions.
                </h1>
                <p className="text-[#7A7266] text-sm">Everything this you spend and earn this month</p>

            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#E4DFD3] mb-10">
                {summary.map((s, i) => (
                    <div
                        key={s.label}
                        className={`p-5 ${i !== summary.length - 1
                            ? "border-b sm:border-b-0 sm:border-r border-[#E4DFD3]"
                            : ""
                            }`}
                    >
                        <p className="text-[#7A7266] text-xs">{s.label}</p>
                        <p className={`${newsreader.className} ${s.color} text-2xl mt-1`}>
                            Rs {s.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* List */}
            <h2 className="text-[#101B2D] text-sm font-medium mb-4">All transactions</h2>
            <div className="flex flex-col">
                {transactions.map((t, i) => (
                    <div
                        key={t.id}
                        className={`flex items-center justify-between py-3 ${i !== transactions.length - 1 ? "border-b border-[#E4DFD3]" : ""
                            }`}
                    >
                        <div>
                            <p className="text-[#101B2D] text-sm">{t.name}</p>
                            <p className="text-[#7A7266] text-xs mt-0.5">
                                {t.category} · {t.date}
                            </p>
                        </div>
                        <span
                            className={`${newsreader.className} text-sm ${t.type === "income" ? "text-[#3F7A5C]" : "text-[#101B2D]"
                                }`}
                        >
                            {t.type === "income" ? "+" : "-"}Rs {t.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}





