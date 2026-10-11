"use client";

import { useCreateCategoryMutation } from "@/redux/api/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Category name is required")
});

export type CategoryBudget = z.infer<typeof categorySchema>;

export default function AddCategoryModal({
    onClose,
    onAdd,
}: {

    onClose: () => void;
    onAdd: (category: CategoryBudget) => void;
}) {
    const form = useForm<CategoryBudget>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "" }
    });

    const [createCategory] = useCreateCategoryMutation();

    async function onSubmit(data: CategoryBudget) {
        console.log("Form submitted!", data);
        try {
            await createCategory({
                name: data.name,
            }).unwrap();

            toast.success("Category added successfully");
            onAdd(data);
            onClose();
        } catch (error) {
            console.error("Failed to add category:", error);
            toast.error("Category already exists or could not be added");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-[#101B2D]/50" onClick={onClose} />

            <div className="relative bg-[#FAF7F2] border border-[#E4DFD3] w-full max-w-sm p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[#101B2D] text-lg font-medium">Add category</h3>
                    <button onClick={onClose} className="text-[#7A7266] hover:text-[#101B2D] transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs text-[#7A7266] uppercase tracking-wide">Category name</label>
                        <input
                            type="text"
                            placeholder="e.g. Subscriptions"
                            className="w-full bg-transparent border-b border-[#D8D0C0] focus:border-[#101B2D] outline-none py-2 text-[#101B2D] text-sm transition-colors"
                            {...form.register("name")}
                        />
                        {form.formState.errors.name && (
                            <p className="text-[#B34747] text-xs mt-1">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-2 bg-[#101B2D] text-[#FAF7F2] text-sm font-medium py-2.5 hover:bg-[#1C2E4A] transition-colors"
                    >
                        Add Category
                    </button>
                </form>
            </div>
        </div>
    );
}
