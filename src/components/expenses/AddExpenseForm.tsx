"use client";
import { useCreateTransactionMutation } from "@/redux/api/transactionApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Newsreader } from "next/font/google";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";


const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

const formSchema = z
    .object({
        type: z.enum(["expense", "income"]),
        description: z.string().max(50, "No more than 50 characters"),
        notes: z.string().max(50, "No more than 50 characters").optional(),

        amount: z
            .string()
            .min(1, "Amount is required")
            .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format (e.g., 10.50)"),

        category: z.string().optional(),

        date: z.string().refine((date) => {
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            const selectedDate = new Date(date);
            return selectedDate <= today;
        }, "Date cannot be in the future"),
    })
    .superRefine((data, ctx) => {
        if (data.type === "expense" && (!data.category || data.category.trim() === "")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["category"],
                message: "Category is required for expenses",
            });
        }
    });

const categories = ["Rent", "Groceries", "Transport", "Dining out", "Utilities", "Other"];

// CHANGED: component now takes isOpen/onClose props instead of rendering as a standalone page
export default function AddExpenseForm({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "expense",
            amount: "",
            category: "",
            description: "",
            date: new Date().toISOString().split("T")[0],
            notes: "",
        }
    })
    const type = form.watch("type");
    const [createTransaction] = useCreateTransactionMutation();
    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data)
        try {
            const result = await createTransaction({
                title: data.description,
                amount: Number(data.amount),
                type: data.type,
                category: data.category,
                date: data.date,
                description: data.notes,
            }).unwrap();
            if (result) {
                toast.success("Transaction added successfully", {className: "toast-success"});
            } else {
                toast.error("Failed to add transaction" , {className: "toast-error"});
            }
            console.log(result);
            form.reset();
            onClose(); // NEW: close the modal automatically after a successful save
        } catch (error) {
            console.error(error);
        }
    }

    // NEW: don't render anything at all while closed (modal is unmounted, not just hidden)
    if (!isOpen) return null;

    return (
        // CHANGED: was `min-h-screen ... flex items-center justify-center` (full page layout)
        // now `fixed inset-0 z-50 ...` so it overlays on top of whatever page is behind it
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

            {/* NEW: backdrop — click outside the card to close */}
            <div className="absolute inset-0 bg-[#101B2D]/50" onClick={onClose} />

            {/* CHANGED: wrapped in `relative` so it sits above the backdrop (z-index stacking),
                and added max-h-[90vh] overflow-y-auto so it doesn't overflow small viewports */}
            <div className="relative bg-[#FAF7F2] border border-[#E4DFD3] w-full max-w-md p-6 md:p-8 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between mb-6">
                    <h2 className={`${newsreader.className} text-[#101B2D] text-2xl`}>New entry</h2>
                    {/* CHANGED: X button was decorative before (no onClick) — now actually closes the modal */}
                    <button onClick={onClose} className="text-[#7A7266] hover:text-[#101B2D] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* type toggle — unchanged */}
                    <div className="flex border border-[#D8D0C0] mb-6 w-fit">
                        <button
                            type="button"
                            onClick={() => form.setValue("type", "expense", { shouldValidate: true })}
                            className={`px-4 py-1.5 text-sm capitalize transition-colors ${type === "expense" ? "bg-[#101B2D] text-[#FAF7F2]" : "text-[#7A7266] hover:text-[#101B2D]"
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => form.setValue("type", "income", { shouldValidate: true })}
                            className={`px-4 py-1.5 text-sm capitalize transition-colors ${type === "income" ? "bg-[#101B2D] text-[#FAF7F2]" : "text-[#7A7266] hover:text-[#101B2D]"
                                }`}
                        >
                            Income
                        </button>
                    </div>

                    {/* amount, category, description, date, notes — all unchanged from your version */}
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
                        {form.formState.errors.amount && (
                            <p className="text-[#B34747] text-xs mt-2">
                                {form.formState.errors.amount.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">

                        {type === "expense" && (
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
                                {form.formState.errors.category && (
                                    <p className="text-[#B34747] text-xs mt-1">
                                        {form.formState.errors.category.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Description</label>
                            <input
                                type="text"
                                {...form.register("description")}
                                placeholder={type === "income" ? "e.g. Monthly salary" : "e.g. Bhat Bhateni groceries"}
                                className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] transition-colors"
                            />
                            {form.formState.errors.description && (
                                <p className="text-[#B34747] text-xs mt-1">
                                    {form.formState.errors.description.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Date</label>
                            <input
                                type="date"
                                {...form.register("date")}
                                className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] transition-colors"
                            />
                            {form.formState.errors.date && (
                                <p className="text-[#B34747] text-xs mt-1">
                                    {form.formState.errors.date.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs text-[#7A7266] uppercase tracking-wide">Notes</label>
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