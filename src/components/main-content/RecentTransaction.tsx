import { useGetTransactionsQuery } from "@/redux/api/transactionApi";
import { Newsreader } from "next/font/google";
import Link from "next/link";

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
export default function RecentTransaction() {

    const { data, isLoading: transcationLoading,
        error: transactionError, } = useGetTransactionsQuery();
    const transactions = data?.data ?? [];
    const recentTransactions = transactions.slice(0, 5);
    if (transcationLoading) {
        return (
            <div>
                <h2 className="text-[#101B2D] text-sm font-medium mb-4">Recent transactions</h2>
                <p className="text-[#7A7266] text-xs mt-0.5">Loading...</p>
            </div>
        )
    }

    if (transactionError) {
        return (
            <div>
                <h2 className="text-[#101B2D] text-sm font-medium mb-4">Recent transactions</h2>
                <p className="text-[#7A7266] text-xs mt-0.5">Error loading transactions</p>
            </div>
        )
    }
    return (
        <div>
            <h2 className="text-[#101B2D] text-sm font-medium mb-4">Recent transactions</h2>
            <div className="flex flex-col">
                {recentTransactions.map((t, i) => (
                    <Link
                        href="/pages/transaction"
                        key={t._id ?? i}
                        className={`flex items-center justify-between py-3 hover:bg-[#F3EFE6] transition-colors ${i !== recentTransactions.length - 1 ? "border-b border-[#E4DFD3]" : ""
                            }`}
                    >
                        <div>
                            <p className="text-[#101B2D] text-md">{t.title}</p>
                            <p className="text-[#7A7266] text-xs mt-0.5">
                                {t.category} · {formatDate(t.date)}
                            </p>
                        </div>
                        <span
                            className={`${newsreader.className} text-sm ${t.type === "income" ? "text-[#3F7A5C]" : "text-[#101B2D]"
                                }`}
                        >
                            {t.type === "income" ? "+" : "-"}Rs {Math.abs(t.amount).toLocaleString()}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}