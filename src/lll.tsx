import { useState } from "react";
import { currenciesData } from "./currenciesData";

export default function CurrencySelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = currenciesData.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
    );

    const selected = currenciesData.find((c) => c.code === value);

    return (
        <div className="relative w-full">

            {/* Selected */}
            <div
                onClick={() => setOpen(!open)}
                className="bg-white/20 border border-white/20 rounded-lg px-3 py-2 cursor-pointer flex justify-between items-center"
            >
                {selected ? (
                    <span>
                        {selected.flag} {selected.code}
                    </span>
                ) : (
                    "Select currency"
                )}
                <span>▼</span>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute mt-2 w-full bg-slate-800 rounded-lg shadow-lg z-50 p-2">

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full mb-2 px-2 py-1 rounded bg-white/10 text-white outline-none"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Options */}
                    <div className="max-h-48 overflow-y-auto">
                        {filtered.map((cur) => (
                            <div
                                key={cur.code}
                                onClick={() => {
                                    onChange(cur.code);
                                    setOpen(false);
                                }}
                                className="px-2 py-2 hover:bg-emerald-500 rounded cursor-pointer flex gap-2"
                            >
                                <span>{cur.flag}</span>
                                <span>{cur.name}</span>
                                <span className="ml-auto text-sm text-gray-300">
                                    {cur.code}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}