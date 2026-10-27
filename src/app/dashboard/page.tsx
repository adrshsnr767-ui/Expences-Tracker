"use client";

import AddExpenseForm from "@/components/expenses/AddExpenseForm";
import BudgetForm from "@/components/forms/BudgetForm";
import BalanceHero from "@/components/main-content/Balance-Hero";
import RecentTransaction from "@/components/main-content/RecentTransaction";
import CategoryBreakdown from "@/components/main-content/SpendingCategory";
import WeeklySpend from "@/components/main-content/WeeklySpend";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { Newsreader } from "next/font/google";
import { useState } from "react";

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

export default function DashboardPage() {
    const [addOpen, setAddOpen] = useState(false);
    const [budgetOpen, setBudgetOpen] = useState(false);
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0];

    return (
        <>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <p className="text-[#7A7266] text-sm">
                        Good to see you, {firstName || ""}
                    </p>
                    <h1 className={`${newsreader.className} text-[#101B2D] text-2xl mt-0.5`}>
                        Here&apos;s your month.
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setAddOpen(true)}
                        className="hidden sm:flex items-center gap-2 bg-[#B8863B] text-white text-sm font-medium px-4 py-2.5 hover:bg-[#C7975A] transition-colors"
                    >
                        <Plus size={16} />
                        Add Transactions
                    </button>
                    <button
                        onClick={() => setBudgetOpen(true)}
                        className="hidden sm:flex items-center gap-2 bg-[#B8863B] text-white text-sm font-medium px-4 py-2.5 hover:bg-[#C7975A] transition-colors"
                    >
                        Set Budget
                    </button>
                </div>
            </div>

            <BalanceHero />
            <WeeklySpend />

            <div className="grid md:grid-cols-2 gap-8">
                <CategoryBreakdown />
                <RecentTransaction />
            </div>

            <AddExpenseForm isOpen={addOpen} onClose={() => setAddOpen(false)} />
            <BudgetForm isOpen={budgetOpen} onClose={() => setBudgetOpen(false)} />
        </>
    );
}