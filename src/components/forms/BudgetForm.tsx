"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import AddCategoryModal, { categorySchema } from "./AddCategoryModal";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useSaveBudgetMutation } from "@/redux/api/budgetApi";

const budgetFormSchema = z.object({
    categories: z
        .array(
            categorySchema.extend({
                _id: z.string(),
                amount: z
                    .string()
                    .min(1, "Budget amount is required")
                    .refine(
                        (val) => !isNaN(Number(val)),
                        "Enter a valid number"
                    )
                    .refine(
                        (val) => Number(val) > 0,
                        "Amount must be greater than 0"
                    ),
            })
        )
        .min(1, "Add at least one category"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export default function BudgetForm({ isOpen, onClose }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { data, isLoading, isError } = useGetCategoriesQuery();
    console.log(data);
    const [saveBudget] = useSaveBudgetMutation();

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetFormSchema),
        defaultValues: { categories: [] },
    });
    const { getValues, reset } = form;
    const { fields } = useFieldArray({
        control: form.control,
        name: "categories",
    });

    
    useEffect(() => {
        if (!data?.data) return;
        const current = getValues("categories");
        reset({
            categories: data.data.map((c) => ({
                _id: c._id,
                name: c.name,
                amount: current.find((x) => x._id === c._id)?.amount ?? "",
            })),
        });
    }, [data, getValues, reset]);

    async function onSubmit(values: BudgetFormValues) {
        try {
            await Promise.all(
                values.categories.map((c) =>
                    saveBudget({ categoryId: c._id, amount: c.amount }).unwrap()
                )
            );
            onClose();
        } catch {
            form.setError("root", { message: "Some budgets failed to save" });
        }
        console.log(values);
    }


    function handleAddCategory() {
        setIsAddOpen(false);
    }

    if (!isOpen) return null;
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading categories</div>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-[#101B2D]/50" onClick={onClose} />
            <div className="relative border border-[#E4DFD3] bg-[#FAF7F2] p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-[#101B2D] text-2xl font-medium">Set your monthly budget</h2>
                    <button onClick={onClose} className="text-[#7A7266] hover:text-[#101B2D] transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-[#7A7266] text-sm mt-1 mb-6">
                    Set spending limits for each category.
                </p>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-5">
                        {fields.map((field, index) => (
                            <div key={field.id}>
                                <label className="text-xs text-[#7A7266] uppercase tracking-wide">
                                    {field.name}
                                </label>

                                <div className="flex items-center gap-2 border-b border-[#D8D0C0] focus-within:border-[#101B2D] transition-colors py-2">
                                    <span className="text-[#7A7266] text-sm">Rs</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full bg-transparent outline-none text-[#101B2D] text-sm"
                                        {...form.register(`categories.${index}.amount` as const)}
                                    />
                                </div>
                                {form.formState.errors.categories?.[index]?.amount && (
                                    <p className="text-[#B34747] text-xs mt-1">
                                        {form.formState.errors.categories[index]?.amount?.message}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsAddOpen(true)}
                        className="flex items-center gap-1.5 text-[#101B2D] text-sm mt-6 hover:text-[#1C2E4A] transition-colors"
                    >
                        <Plus size={15} />
                        Add Category
                    </button>

                    {form.formState.errors.root && (
                        <p className="text-[#B34747] text-xs mt-4">
                            {form.formState.errors.root.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full mt-8 bg-[#101B2D] text-[#FAF7F2] text-sm font-medium py-3 hover:bg-[#1C2E4A] transition-colors disabled:opacity-60"
                    >
                        {form.formState.isSubmitting ? "Saving..." : "Save Budget"}
                    </button>
                </form>

                {isAddOpen && (
                    <AddCategoryModal
                        onClose={() => setIsAddOpen(false)}
                        onAdd={handleAddCategory}
                    />
                )}
            </div>
        </div>
    );
}