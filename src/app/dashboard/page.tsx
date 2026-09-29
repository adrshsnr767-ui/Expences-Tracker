"use client";

import BalanceHero from "@/components/main-content/Balance-Hero";
import RecentTransaction from "@/components/main-content/RecentTransaction";
import CategoryBreakdown from "@/components/main-content/SpendingCategory";
import WeeklySpend from "@/components/main-content/WeeklySpend";
import {
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    Receipt,
    Settings,
    Tag,
    X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Newsreader } from "next/font/google";
import { useState } from "react";

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Transactions", icon: Receipt, active: false },
    { label: "Categories", icon: Tag, active: false },
    { label: "Settings", icon: Settings, active: false },
];






export default function DashboardPage() {
    const [navOpen, setNavOpen] = useState(false);



    return (
        <div className="min-h-screen bg-[#FAF7F2] md:flex">

            {/* Mobile top bar */}
            <div className="md:hidden flex items-center justify-between bg-[#101B2D] px-5 py-4">
                <span className={`${newsreader.className} text-[#FAF7F2] text-xl italic`}>Khaata</span>
                <button onClick={() => setNavOpen(!navOpen)} className="text-[#FAF7F2]">
                    {navOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`
                    bg-[#101B2D] w-full md:w-60 md:flex md:flex-col md:justify-between md:p-6 md:py-8
                    ${navOpen ? "flex flex-col p-6 py-6" : "hidden"}
                `}
            >
                <div>
                    <div className={`${newsreader.className} hidden md:block text-[#FAF7F2] text-2xl italic mb-10`}>
                        Khaata
                    </div>
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left
                                    ${item.active
                                        ? "bg-[#1C2E4A] text-[#FAF7F2]"
                                        : "text-[#9CA9BE] hover:text-[#FAF7F2]"}
                                `}
                            >
                                <item.icon size={17} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <button className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#9CA9BE] hover:text-[#FAF7F2] transition-colors mt-8 md:mt-0">
                    <LogOut size={17} />
                    Log out
                </button>
            </aside>

            {/* Main content */}
            <main className="flex-1 px-6 py-8 md:px-10 md:py-10 w-full">

                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-[#7A7266] text-sm">Good to see you, Aadarsha</p>
                        <h1 className={`${newsreader.className} text-[#101B2D] text-2xl mt-0.5`}>
                            Here`&apos`s your month.
                        </h1>
                    </div>
                    <button onClick={() => signOut()}

                        className="hidden sm:flex items-center gap-2 bg-[#B8863B] text-[#101B2D] text-sm font-medium px-4 py-2.5 hover:bg-[#C7975A] transition-colors">
                        <Plus size={16} />
                        Add expense
                    </button>
                </div>

                {/* Balance hero */}
                <BalanceHero />

                {/* Weekly spend */}
                <WeeklySpend />

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Category breakdown */}
                    <CategoryBreakdown />

                    {/* Recent transactions */}
                 <RecentTransaction/>
                </div>
            </main>
        </div>
    );
}

