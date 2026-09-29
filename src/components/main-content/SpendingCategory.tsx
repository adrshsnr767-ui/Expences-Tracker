export default function CategoryBreakdown() {
    const categories = [
        { label: "Rent", spent: 8000, budget: 8000, color: "#101B2D" },
        { label: "Groceries", spent: 4120, budget: 5000, color: "#B8863B" },
        { label: "Transport", spent: 1860, budget: 2500, color: "#3F7A5C" },
        { label: "Dining out", spent: 2340, budget: 2000, color: "#B34747" },
        { label: "Utilities", spent: 1450, budget: 1500, color: "#7A7266" },
    ];
    return (
        <div>
            <h2 className="text-[#101B2D] text-sm font-medium mb-4">Spending by category</h2>
            <div className="flex flex-col">
                {categories.map((c, i) => {
                    const pct = Math.min(100, (c.spent / c.budget) * 100);
                    return (
                        <div
                            key={c.label}
                            className={`py-3 ${i !== categories.length - 1 ? "border-b border-[#E4DFD3]" : ""}`}
                        >
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-[#101B2D]">{c.label}</span>
                                <span className="text-[#7A7266]">
                                    Rs {c.spent.toLocaleString()} / {c.budget.toLocaleString()}
                                </span>
                            </div>
                            <div className="h-1 bg-[#E4DFD3] w-full">
                                <div
                                    className="h-1"
                                    style={{ width: `${pct}%`, backgroundColor: c.color }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}