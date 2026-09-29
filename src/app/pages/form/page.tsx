"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Newsreader } from "next/font/google";
import { useForm } from "react-hook-form";
import z from "zod";


const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

const formSchema = z.object({
    description: z.string().max(50, "No more then 50 characters"),
    notes: z.string().max(50, "No more then 50 characters"),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
    category: z.string().min(1, "Category is required"),
    date: z.string().refine((date) => {
        const today = new Date();
        const selectedDate = new Date(date);
        return selectedDate <= today;
    }, "Date cannot be in the future"),
})

const categories = ["Rent", "Groceries", "Transport", "Dining out", "Utilities", "Other"];

export default function AddExpenseForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            category: "",
            description: "",
            date: new Date().toISOString().split("T")[0],
            notes: "",
        }
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
    }
    return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-10">
            <div className="bg-[#FAF7F2] border border-[#E4DFD3] w-full max-w-md p-6 md:p-8">

                <div className="flex items-center justify-between mb-6">
                    <h2 className={`${newsreader.className} text-[#101B2D] text-2xl`}>New entry</h2>
                    <button className="text-[#7A7266] hover:text-[#101B2D] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>

                    {/* type toggle */}
                    <div className="flex border border-[#D8D0C0] mb-6 w-fit">
                        <button type="button" className="px-4 py-1.5 text-sm capitalize bg-[#101B2D] text-[#FAF7F2]">
                            Expense
                        </button>
                        <button type="button" className="px-4 py-1.5 text-sm capitalize text-[#7A7266] hover:text-[#101B2D] transition-colors">
                            Income
                        </button>
                    </div>

                    {/* amount */}
                    <div className="mb-6 text-center border-b border-[#D8D0C0] pb-4">
                        <label className="text-[#7A7266] text-xs uppercase tracking-wide">Amount</label>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <span className={`${newsreader.className} text-[#7A7266] text-2xl`}>Rs</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className={`${newsreader.className} bg-transparent outline-none text-[#101B2D] text-4xl text-center w-40`}
                                {...form.register("amount")}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Category</label>
                            <select
                                {...form.register("category")}
                                defaultValue=""
                                className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] transition-colors"
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Description</label>
                            <input
                                type="text"
                                {...form.register("description")}
                                placeholder="e.g. Bhat Bhateni groceries"
                                className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Date</label>
                            <input
                                type="date"
                                {...form.register("date")}
                                className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Notes (optional)</label>
                            <textarea
                                rows={2}
                                {...form.register("notes")}
                                placeholder="Anything worth remembering about this one"
                                className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-8 bg-[#101B2D] text-[#FAF7F2] text-sm font-medium py-3 hover:bg-[#1C2E4A] transition-colors"
                    >
                        Add entry
                    </button>
                </form>
            </div>
        </div>
    );
}