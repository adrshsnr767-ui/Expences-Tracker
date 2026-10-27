import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import { Toaster } from "sonner";
import ReduxProvider from "@/provider/ReduxProvider";
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Khaata",
        template: "%s | Khaata",
    },
    description: "Track your spending and budgets",
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <AppShell>
                    <ReduxProvider>
                        <AuthSessionProvider>
                            {children}
                            <Toaster />
                        </AuthSessionProvider>
                    </ReduxProvider>
                </AppShell>
            </body>
        </html>
    );
}