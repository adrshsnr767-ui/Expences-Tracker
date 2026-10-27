"use client";

import {
    LayoutDashboard,
    LogOut,
    Menu,
    Receipt,
    Settings,
    Tag,
    X,
} from "lucide-react";
import { Newsreader } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Transactions", icon: Receipt, href: "pages/transaction" },
    { label: "Categories", icon: Tag, href: "pages/categories" },
    { label: "Settings", icon: Settings, href: "pages/settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [navOpen, setNavOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#FAF7F2] md:flex">
            {/* Mobile top bar */}
            <div className="md:hidden flex items-center justify-between bg-[#101B2D] px-5 py-4">
                <span className={`${newsreader.className} text-[#FAF7F2] text-xl italic`}>
                    Khaata
                </span>
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
                    <div
                        className={`${newsreader.className} hidden md:block text-[#FAF7F2] text-2xl italic mb-10`}
                    >
                        Khaata
                    </div>

                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setNavOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 text-sm transition-colors
                                        ${active
                                            ? "bg-[#1C2E4A] text-[#FAF7F2]"
                                            : "text-[#9CA9BE] hover:text-[#FAF7F2]"}
                                    `}
                                >
                                    <item.icon size={17} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <button className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#9CA9BE] hover:text-[#FAF7F2] transition-colors mt-8 md:mt-0">
                    <LogOut size={17} />
                    Log out
                </button>
            </aside>

            {/* Page content goes here */}
            <main className="flex-1 px-6 py-8 md:px-10 md:py-10 w-full">
                {children}
            </main>
        </div>
    );
}