"use client";

import { useState, useEffect, useCallback } from "react";
import { Plane, X, Globe } from "lucide-react";
import { Airport, AIRPORTS } from "@/constants/airports";

interface AirportSelectorProps {
    label: string;
    value: string;
    airport: Airport | null;
    onChange: (query: string, airport: Airport | null) => void;
    onFocus?: () => void;
    isActive?: boolean;
    showExploreEverywhere?: boolean;
    placeholder?: string;
}

export default function AirportSelector({
    label,
    value,
    airport,
    onChange,
    onFocus,
    isActive = false,
    showExploreEverywhere = false,
    placeholder = "Country, city or airport",
}: AirportSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Airport[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search for airports
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (value && isOpen) {
                setIsSearching(true);
                try {
                    const { searchAirportsAction } = await import("@/actions/flightActions");
                    const results = await searchAirportsAction(value);

                    const mappedResults: Airport[] = results.map((place: any) => ({
                        code: place.iata_code,
                        city: place.city_name || place.name,
                        name: place.name,
                        country: place.country_name || place.country?.name || "",
                        distance: null,
                    }));

                    setSuggestions(mappedResults.length > 0 ? mappedResults : []);
                } catch (e) {
                    console.error(e);
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [value, isOpen]);

    const handleSelect = useCallback(
        (selectedAirport: Airport) => {
            onChange(`${selectedAirport.city} (${selectedAirport.code})`, selectedAirport);
            setIsOpen(false);
        },
        [onChange]
    );

    const handleClear = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onChange("", null);
        },
        [onChange]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value, null);
            setIsOpen(true);
        },
        [onChange]
    );

    const handleFocus = useCallback(() => {
        setIsOpen(true);
        onFocus?.();
    }, [onFocus]);

    return (
        <div className="relative flex-1">
            <div
                className={`w-full flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left cursor-text ${isActive ? "ring-2 ring-[#0770e3] rounded-lg z-10" : ""
                    }`}
                onClick={handleFocus}
            >
                <div className="flex flex-col min-w-0 flex-1">
                    <label className="text-xs text-[#68697f] font-medium block">{label}</label>
                    <input
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        className="w-full text-sm font-semibold text-[#161616] truncate bg-transparent outline-none p-0 border-none placeholder-gray-400"
                        placeholder={placeholder}
                    />
                </div>
                {value && (
                    <button onClick={handleClear} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-4 h-4 text-[#68697f]" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-[60] w-80 max-h-96 overflow-hidden overflow-y-auto">
                    <div className="py-2">
                        {isSearching ? (
                            <div className="px-4 py-3 text-sm text-[#68697f]">Searching...</div>
                        ) : suggestions.length > 0 ? (
                            suggestions.map((apt) => (
                                <button
                                    key={apt.code}
                                    onClick={() => handleSelect(apt)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3"
                                >
                                    <Plane className="w-5 h-5 text-[#68697f] mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-[#161616]">
                                            {apt.city} ({apt.code})
                                        </p>
                                        <p className="text-xs text-[#68697f]">
                                            {apt.name}, {apt.country}
                                        </p>
                                        {apt.distance && (
                                            <p className="text-xs text-[#68697f]">{apt.distance}</p>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-[#68697f]">No results found</div>
                        )}

                        {showExploreEverywhere && (
                            <>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <Globe className="w-5 h-5 text-[#0770e3]" />
                                    <span className="text-sm font-medium text-[#0770e3]">
                                        Explore everywhere
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Hook to manage airport selection state
export function useAirportState(
    initialQuery: string,
    initialAirport: Airport | null
) {
    const [query, setQuery] = useState(initialQuery);
    const [airport, setAirport] = useState<Airport | null>(initialAirport);

    const handleChange = useCallback((newQuery: string, newAirport: Airport | null) => {
        setQuery(newQuery);
        setAirport(newAirport);
    }, []);

    return { query, airport, handleChange };
}
