"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchForm from "@/components/search/SearchForm";
import { getCityName } from "@/constants/airports";

interface CollapsibleSearchBarProps {
    from: string;
    to: string;
    depart: string;
    returnDate?: string;
    adults: number;
    cabin: string;
}

export default function CollapsibleSearchBar({
    from,
    to,
    depart,
    returnDate,
    adults,
    cabin,
}: CollapsibleSearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    const formatDateFull = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });
    };

    // Handle date arrows in collapsed mode
    const adjustDate = (days: number) => {
        const date = new Date(depart);
        date.setDate(date.getDate() + days);
        const newDateStr = date.toISOString().split("T")[0];

        const params = new URLSearchParams(window.location.search);
        params.set("depart", newDateStr);
        router.push(`/flights?${params.toString()}`);
    };

    return (
        <div className="bg-[#05203c] py-4 mb-4 transition-all duration-300 ease-in-out relative z-50">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
                {/* Toggle Bar */}
                <div
                    className={`bg-[#1a3b5c] rounded-md flex items-center p-1 cursor-pointer transition-colors border border-transparent 
                ${isExpanded
                            ? "bg-[#23456b] border-gray-500/50"
                            : "hover:bg-[#23456b] hover:border-gray-500/30"
                        }`}
                >
                    {/* Search Icon / Toggle Trigger */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="bg-[#0770e3] hover:bg-[#0661c5] text-white p-2.5 rounded-md flex-shrink-0 transition-colors"
                        aria-label="Toggle search form"
                    >
                        {isExpanded ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        )}
                    </button>

                    {/* Middle Section: Route & Details - Click to expand */}
                    <div
                        className="flex-1 flex flex-col md:flex-row md:items-center px-4 gap-1 md:gap-4 overflow-hidden"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className="text-white font-semibold truncate flex items-center gap-2">
                            <span>
                                {getCityName(from)} ({from})
                            </span>
                            <span className="text-gray-400">→</span>
                            <span>
                                {getCityName(to)} ({to})
                            </span>
                        </div>
                        <div className="text-gray-300 text-sm truncate border-l border-gray-600 pl-4 hidden md:block">
                            {adults} Adult, {cabin}
                        </div>
                    </div>

                    {/* Right Section: Date Navigation */}
                    <div
                        className="flex items-center gap-1 bg-[#05203c] rounded p-1 ml-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => adjustDate(-1)}
                            className="p-1.5 text-white hover:bg-white/10 rounded"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <span className="text-white font-medium text-sm whitespace-nowrap px-2">
                            {formatDateFull(depart)}
                        </span>
                        <button
                            onClick={() => adjustDate(1)}
                            className="p-1.5 text-white hover:bg-white/10 rounded"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Expanded Form Area */}
                {isExpanded && (
                    <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <SearchForm
                            initialFrom={{
                                code: from,
                                city: getCityName(from),
                                name: "",
                                country: "",
                            }}
                            initialTo={{
                                code: to,
                                city: getCityName(to),
                                name: "",
                                country: "",
                            }}
                            initialDepart={new Date(depart)}
                            initialReturn={returnDate ? new Date(returnDate) : null}
                            initialAdults={adults}
                            initialCabin={cabin}
                            className="bg-white/5 rounded-xl p-6 backdrop-blur-sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
