"use client";

import { useState, useCallback } from "react";
import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { Airport, AIRPORTS } from "@/constants/airports";
import AirportSelector from "@/components/search/AirportSelector";
import CalendarPicker, { formatDate } from "@/components/search/CalendarPicker";
import TravelersSelector from "@/components/search/TravelersSelector";

interface SearchFormProps {
    initialFrom?: { code: string; city: string; name: string; country: string };
    initialTo?: { code: string; city: string; name: string; country: string };
    initialDepart?: Date;
    initialReturn?: Date | null;
    initialAdults?: number;
    initialChildren?: number;
    initialCabin?: string;
    initialTripType?: "Return" | "One-way";
    className?: string;
}

export default function SearchForm({
    initialFrom,
    initialTo,
    initialDepart,
    initialReturn,
    initialAdults = 1,
    initialChildren = 0,
    initialCabin = "Economy",
    initialTripType = "Return",
    className,
}: SearchFormProps = {}) {
    // Trip type state
    const [tripType, setTripType] = useState<"Return" | "One-way">(initialTripType);
    const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);

    // Airport state
    const [fromQuery, setFromQuery] = useState(
        initialFrom ? `${initialFrom.city} (${initialFrom.code})` : "Bengaluru (BLR)"
    );
    const [toQuery, setToQuery] = useState(
        initialTo ? `${initialTo.city} (${initialTo.code})` : "Agra (AGR)"
    );
    const [fromAirport, setFromAirport] = useState<Airport | null>(
        initialFrom ? { ...initialFrom, distance: null } : AIRPORTS[0]
    );
    const [toAirport, setToAirport] = useState<Airport | null>(
        initialTo ? { ...initialTo, distance: null } : AIRPORTS[5]
    );

    // Date state
    const [departDate, setDepartDate] = useState<Date | null>(
        initialDepart || new Date(2026, 1, 26)
    );
    const [returnDate, setReturnDate] = useState<Date | null>(
        initialReturn || (initialTripType === "Return" ? new Date(2026, 2, 3) : null)
    );
    const [showCalendar, setShowCalendar] = useState(false);

    // Travelers state
    const [adults, setAdults] = useState(initialAdults);
    const [children, setChildren] = useState(initialChildren);
    const [cabinClass, setCabinClass] = useState(initialCabin);
    const [showTravelers, setShowTravelers] = useState(false);

    // Active field highlight state
    const [activeField, setActiveField] = useState<string | null>(null);

    const closeAllDropdowns = useCallback(() => {
        setShowTripTypeDropdown(false);
        setShowCalendar(false);
        setShowTravelers(false);
        setActiveField(null);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams({
            from: fromAirport ? fromAirport.code : fromQuery,
            to: toAirport ? toAirport.code : toQuery,
            depart: departDate ? departDate.toISOString().split("T")[0] : "",
            return: returnDate ? returnDate.toISOString().split("T")[0] : "",
            adults: adults.toString(),
            children: children.toString(),
            cabin: cabinClass,
        });
        window.location.href = `/flights?${params.toString()}`;
    };

    const swapAirports = () => {
        setFromQuery(toQuery);
        setFromAirport(toAirport);
        setToQuery(fromQuery);
        setToAirport(fromAirport);
    };

    const handleFromChange = (query: string, airport: Airport | null) => {
        setFromQuery(query);
        setFromAirport(airport);
        if (airport) setActiveField(null);
    };

    const handleToChange = (query: string, airport: Airport | null) => {
        setToQuery(query);
        setToAirport(airport);
        if (airport) setActiveField(null);
    };

    return (
        <div className={`w-full max-w-[1000px] mx-auto relative ${className || ""}`}>
            {/* Overlay to close dropdowns */}
            {(showTripTypeDropdown || showCalendar || showTravelers) && (
                <div className="fixed inset-0 z-40" onClick={closeAllDropdowns} />
            )}

            {/* Trip Type Toggle */}
            <div className="mb-4 relative z-[60]">
                <button
                    onClick={() => {
                        closeAllDropdowns();
                        setShowTripTypeDropdown(!showTripTypeDropdown);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a4166] rounded-md text-white text-sm font-medium hover:bg-[#2a5176] transition-colors"
                >
                    {tripType}
                    <ChevronDown
                        className={`w-4 h-4 transition-transform ${showTripTypeDropdown ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {showTripTypeDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 min-w-[150px]">
                        {(["Return", "One-way"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    setTripType(type);
                                    if (type === "One-way") setReturnDate(null);
                                    setShowTripTypeDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${tripType === type ? "text-[#0770e3] font-medium" : "text-[#161616]"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Search Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-visible relative z-50">
                <div className="flex flex-col lg:flex-row items-stretch">
                    {/* From Input */}
                    <div
                        className={`flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative ${activeField === "from" ? "ring-2 ring-[#0770e3] rounded-l-lg z-10" : ""
                            }`}
                    >
                        <AirportSelector
                            label="From"
                            value={fromQuery}
                            airport={fromAirport}
                            onChange={handleFromChange}
                            onFocus={() => {
                                closeAllDropdowns();
                                setActiveField("from");
                            }}
                            isActive={activeField === "from"}
                            placeholder="Country, city or airport"
                        />

                        {/* Swap Button */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden lg:flex">
                            <button
                                onClick={swapAirports}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#0770e3] hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <ArrowLeftRight className="w-4 h-4 text-[#0770e3]" />
                            </button>
                        </div>
                    </div>

                    {/* To Input */}
                    <div
                        className={`flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative ${activeField === "to" ? "ring-2 ring-[#0770e3] z-10" : ""
                            }`}
                    >
                        <div className="lg:pl-4">
                            <AirportSelector
                                label="To"
                                value={toQuery}
                                airport={toAirport}
                                onChange={handleToChange}
                                onFocus={() => {
                                    closeAllDropdowns();
                                    setActiveField("to");
                                }}
                                isActive={activeField === "to"}
                                showExploreEverywhere={true}
                                placeholder="Country, city or airport"
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div
                        className={`flex-[1.5] border-b lg:border-b-0 lg:border-r border-gray-200 flex relative ${activeField === "date" ? "ring-2 ring-[#0770e3] z-10" : ""
                            }`}
                    >
                        {/* Depart */}
                        <div
                            className={`flex-1 flex flex-col justify-center px-4 py-4 hover:bg-gray-50 cursor-pointer border-r border-gray-100 ${!departDate ? "text-gray-400" : ""
                                }`}
                            onClick={() => {
                                closeAllDropdowns();
                                setShowCalendar(true);
                                setActiveField("date");
                            }}
                        >
                            <span className="text-xs text-[#68697f] font-medium block">Depart</span>
                            <span className="text-sm font-semibold text-[#161616]">
                                {formatDate(departDate)}
                            </span>
                        </div>

                        {/* Return */}
                        {tripType === "Return" && (
                            <div
                                className={`flex-1 flex flex-col justify-center px-4 py-4 hover:bg-gray-50 cursor-pointer ${!returnDate ? "text-gray-400" : ""
                                    }`}
                                onClick={() => {
                                    closeAllDropdowns();
                                    setShowCalendar(true);
                                    setActiveField("date");
                                }}
                            >
                                <span className="text-xs text-[#68697f] font-medium block">Return</span>
                                <span className="text-sm font-semibold text-[#161616]">
                                    {formatDate(returnDate)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Travelers */}
                    <div
                        className={`flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative ${activeField === "travelers" ? "ring-2 ring-[#0770e3] z-10" : ""
                            }`}
                    >
                        <TravelersSelector
                            adults={adults}
                            children={children} // Renamed prop to avoid collision
                            cabinClass={cabinClass}
                            onAdultsChange={setAdults}
                            onChildrenChange={setChildren}
                            onCabinChange={setCabinClass}
                            isOpen={showTravelers}
                            onToggle={() => {
                                closeAllDropdowns();
                                setShowTravelers(!showTravelers);
                                setActiveField("travelers");
                            }}
                            onClose={() => {
                                setShowTravelers(false);
                                setActiveField(null);
                            }}
                        />
                    </div>

                    {/* Search Button */}
                    <div className="p-2 flex items-center">
                        <button
                            onClick={handleSearch}
                            className="w-full lg:w-auto h-full px-6 py-4 bg-[#0770e3] text-white rounded-lg font-semibold hover:bg-[#0560c2] transition-colors flex items-center justify-center gap-2 min-w-[100px]"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Dropdown */}
            <CalendarPicker
                departDate={departDate}
                returnDate={returnDate}
                tripType={tripType}
                onDepartChange={setDepartDate}
                onReturnChange={setReturnDate}
                onTripTypeChange={(type) => {
                    setTripType(type);
                    if (type === "One-way") setReturnDate(null);
                }}
                isOpen={showCalendar}
                onClose={() => {
                    setShowCalendar(false);
                    setActiveField(null);
                }}
            />
        </div>
    );
}
