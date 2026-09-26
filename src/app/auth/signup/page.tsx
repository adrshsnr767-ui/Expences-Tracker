"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Newsreader } from "next/font/google";

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

const SiginUpSchema = z.object({
    name: z.string().min(2, "name must be at least two characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof SiginUpSchema>>({
        resolver: zodResolver(SiginUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })
    const router = useRouter();
    async function onSubmit(data: z.infer<typeof SiginUpSchema>) {
        const response = await fetch("/api/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const result = await response.json();
        if (response.ok && result.success) {
            router.push("/auth/login");
        }

        console.log(result);
    }

    return (
        <div className="min-h-screen flex bg-[#FAF7F2]">

            {/* Left: brand / ledger panel — hidden on mobile, shown as strip below */}
            <div className="hidden md:flex md:w-[42%] bg-[#101B2D] flex-col justify-between p-10 lg:p-14">
                <div className={`${newsreader.className} text-[#FAF7F2] text-2xl italic`}>
                    Khaata
                </div>

                <div>
                    <h1 className={`${newsreader.className} text-[#FAF7F2] text-4xl lg:text-[2.75rem] leading-[1.15] font-normal`}>
                        Know where every
                        <br />
                        rupee goes.
                    </h1>
                    <p className="text-[#9CA9BE] text-sm mt-4 max-w-[30ch]">
                        Track spending, split by category, and see your month at a glance — no spreadsheet required.
                    </p>

                    {/* mock stat card, grounded in actual expense-tracker content */}
                    <div className="mt-10 border border-[#2A3B57] p-5 max-w-xs">
                        <div className="flex items-baseline justify-between">
                            <span className="text-[#9CA9BE] text-xs">This month</span>
                            <span className="text-[#3F7A5C] text-xs">-12% vs last</span>
                        </div>
                        <div className={`${newsreader.className} text-[#FAF7F2] text-3xl mt-2`}>
                            Rs 12,450
                        </div>
                        <div className="flex items-end gap-1.5 mt-5 h-12">
                            {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-[#B8863B]"
                                    style={{ height: `${h}%`, opacity: 0.4 + (h / 200) }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-[#5A6B85] text-xs">
                    Built for people who check their balance before payday.
                </p>
            </div>

            {/* Mobile-only compact header */}
            <div className="md:hidden fixed top-0 inset-x-0 bg-[#101B2D] px-6 py-4 z-10">
                <span className={`${newsreader.className} text-[#FAF7F2] text-xl italic`}>Khaata</span>
            </div>

            {/* Right: form */}
            <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-10 md:pt-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm">

                    <h2 className={`${newsreader.className} text-[#101B2D] text-3xl mb-1`}>
                        Create your account
                    </h2>
                    <p className="text-[#7A7266] text-sm mb-8">
                        Start tracking in under a minute.
                    </p>

                    <div className="flex flex-col gap-5">

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Name</label>
                            <input
                                className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] transition-colors"
                                type="text"
                                placeholder="Your full name"
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-[#B34747] text-xs mt-1">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Email</label>
                            <input
                                className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] transition-colors"
                                type="email"
                                placeholder="you@example.com"
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && (
                                <p className="text-[#B34747] text-xs mt-1">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Password</label>
                            <div className="relative">
                                <input
                                    className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 pr-8 text-[#101B2D] transition-colors"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="At least 8 characters"
                                    {...form.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-2 text-[#A39A8B] hover:text-[#101B2D] transition-colors"
                                >
                                    {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-[#B34747] text-xs mt-1">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-9 bg-[#101B2D] text-[#FAF7F2] text-sm font-medium py-3 hover:bg-[#1C2E4A] transition-colors"
                    >
                        Create account
                    </button>

                    <p className="text-center text-sm text-[#7A7266] mt-6">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-[#101B2D] underline underline-offset-4">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}