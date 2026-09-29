import { Newsreader } from "next/font/google";

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});
export default function RecentTransaction() {
    const transactions = [
        { name: "Bhat Bhateni Supermarket", category: "Groceries", date: "Sep 28", amount: -1240, type: "expense" },
        { name: "Salary — Deerwalk Pvt Ltd", category: "Income", date: "Sep 27", amount: 45000, type: "income" },
        { name: "Pathao ride", category: "Transport", date: "Sep 26", amount: -320, type: "expense" },
        { name: "NEA Electricity Bill", category: "Utilities", date: "Sep 24", amount: -1450, type: "expense" },
        { name: "Cafe Soma", category: "Dining out", date: "Sep 23", amount: -680, type: "expense" },
        { name: "House rent", category: "Rent", date: "Sep 21", amount: -8000, type: "expense" },
    ];

    return (
        <div>
            <h2 className="text-[#101B2D] text-sm font-medium mb-4">Recent transactions</h2>
            <div className="flex flex-col">
                {transactions.map((t, i) => (
                    <div
                        key={i}
                        className={`flex items-center justify-between py-3 ${i !== transactions.length - 1 ? "border-b border-[#E4DFD3]" : ""
                            }`}
                    >
                        <div>
                            <p className="text-[#101B2D] text-sm">{t.name}</p>
                            <p className="text-[#7A7266] text-xs mt-0.5">{t.category} · {t.date}</p>
                        </div>
                        <span
                            className={`${newsreader.className} text-sm ${t.type === "income" ? "text-[#3F7A5C]" : "text-[#101B2D]"
                                }`}
                        >
                            {t.type === "income" ? "+" : "-"}Rs {Math.abs(t.amount).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}