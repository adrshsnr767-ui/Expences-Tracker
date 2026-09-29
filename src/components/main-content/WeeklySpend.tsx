export default function WeeklySpend() {
    const weeklySpend = [
        { day: "Mon", amt: 45 },
        { day: "Tue", amt: 70 },
        { day: "Wed", amt: 30 },
        { day: "Thu", amt: 85 },
        { day: "Fri", amt: 95 },
        { day: "Sat", amt: 60 },
        { day: "Sun", amt: 25 },
    ];
    return (
        <div className="border border-[#E4DFD3] p-6 mb-8">
            <span className="text-[#7A7266] text-xs uppercase tracking-wide">This week</span>
            <div className="flex items-end gap-3 mt-5 h-24">
                {weeklySpend.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-[#101B2D]/90" style={{ height: `${d.amt}%` }} />
                        <span className="text-[#7A7266] text-xs">{d.day}</span>
                    </div>
                ))}
            </div>
        </div>

    )
}