"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, ChevronDown, ChevronLeft, ChevronRight, Check, X, Plane, Globe, Minus, Plus } from "lucide-react";

// Mock airport data with distances
const airports = [
    { code: "BLR", city: "Bengaluru", name: "Kempegowda International Airport", country: "India", distance: null },
    { code: "SXV", city: "Salem", name: "Salem Airport", country: "India", distance: "160 km from Bengaluru" },
    { code: "MYQ", city: "Mysore", name: "Mysore Airport", country: "India", distance: "128 km from Bengaluru" },
    { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport", country: "India", distance: null },
    { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj", country: "India", distance: null },
    { code: "AGR", city: "Agra", name: "Agra Airport", country: "India", distance: null },
    { code: "GOI", city: "Goa", name: "Goa International Airport", country: "India", distance: null },
    { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India", distance: null },
    { code: "MAA", city: "Chennai", name: "Chennai International Airport", country: "India", distance: null },
    { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose", country: "India", distance: null },
    { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "UAE", distance: null },
    { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore", distance: null },
];

interface Airport {
    code: string;
    city: string;
    name: string;
    country: string;
    distance: string | null;
}

interface SearchFormProps {
    initialFrom?: { code: string; city: string; name: string; country: string };
    initialTo?: { code: string; city: string; name: string; country: string };
    initialDepart?: Date;
    initialReturn?: Date | null;
    initialAdults?: number;
    initialChildren?: number;
    initialCabin?: string;
    initialTripType?: string;
    className?: string; // To allow custom styling wrapper if needed
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
    className
}: SearchFormProps = {}) {
    // Trip type
    const [tripType, setTripType] = useState(initialTripType);
    const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);

    // Airports
    const [fromQuery, setFromQuery] = useState(initialFrom ? `${initialFrom.city} (${initialFrom.code})` : "Bengaluru (BLR)");
    const [toQuery, setToQuery] = useState(initialTo ? `${initialTo.city} (${initialTo.code})` : "Agra (AGR)");
    const [fromAirport, setFromAirport] = useState<Airport | null>(initialFrom ? { ...initialFrom, distance: null } : airports[0]);
    const [toAirport, setToAirport] = useState<Airport | null>(initialTo ? { ...initialTo, distance: null } : airports[5]);

    const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
    const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
    const [isSearchingFrom, setIsSearchingFrom] = useState(false);
    const [isSearchingTo, setIsSearchingTo] = useState(false);

    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    // Debounced search for airports
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (fromQuery && showFromDropdown) {
                setIsSearchingFrom(true);
                try {
                    const { searchAirportsAction } = await import('@/actions/flightActions');
                    const results = await searchAirportsAction(fromQuery);

                    const mappedResults: Airport[] = results.map((place: any) => ({
                        code: place.iata_code,
                        city: place.city_name || place.name,
                        name: place.name,
                        country: place.country_name || place.country?.name || '',
                        distance: null
                    }));

                    setFromSuggestions(mappedResults.length > 0 ? mappedResults : []);
                } catch (e) {
                    console.error(e);
                    setFromSuggestions([]);
                } finally {
                    setIsSearchingFrom(false);
                }
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [fromQuery, showFromDropdown]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (toQuery && showToDropdown) {
                setIsSearchingTo(true);
                try {
                    const { searchAirportsAction } = await import('@/actions/flightActions');
                    const results = await searchAirportsAction(toQuery);

                    const mappedResults: Airport[] = results.map((place: any) => ({
                        code: place.iata_code,
                        city: place.city_name || place.name,
                        name: place.name,
                        country: place.country_name || place.country?.name || '',
                        distance: null
                    }));

                    setToSuggestions(mappedResults.length > 0 ? mappedResults : []);
                } catch (e) {
                    console.error(e);
                    setToSuggestions([]);
                } finally {
                    setIsSearchingTo(false);
                }
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [toQuery, showToDropdown]);

    // Dates
    const [departDate, setDepartDate] = useState<Date | null>(initialDepart || new Date(2026, 1, 26));
    const [returnDate, setReturnDate] = useState<Date | null>(initialReturn !== undefined ? initialReturn : new Date(2026, 2, 3));
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarType, setCalendarType] = useState<"specific" | "flexible">("specific");
    const [selectingDate, setSelectingDate] = useState<"depart" | "return">("depart");
    const [calendarMonth, setCalendarMonth] = useState(initialDepart || new Date(2026, 1, 1));

    // Travelers
    const [showTravelers, setShowTravelers] = useState(false);
    const [adults, setAdults] = useState(initialAdults);
    const [children, setChildren] = useState(initialChildren);
    const [cabinClass, setCabinClass] = useState(initialCabin);
    const [showCabinDropdown, setShowCabinDropdown] = useState(false);

    // Checkboxes
    const [addNearbyFrom, setAddNearbyFrom] = useState(false);
    const [addNearbyTo, setAddNearbyTo] = useState(false);
    const [directFlights, setDirectFlights] = useState(false);
    const [addHotel, setAddHotel] = useState(true);

    // Active field highlight
    const [activeField, setActiveField] = useState<string | null>(null);

    const closeAllDropdowns = () => {
        setShowTripTypeDropdown(false);
        setShowFromDropdown(false);
        setShowToDropdown(false);
        setShowCalendar(false);
        setShowTravelers(false);
        setShowCabinDropdown(false);
        setActiveField(null);
    };

    const handleSearch = () => {
        const params = new URLSearchParams({
            from: fromAirport ? fromAirport.code : fromQuery,
            to: toAirport ? toAirport.code : toQuery,
            depart: departDate ? departDate.toISOString().split('T')[0] : '',
            return: returnDate ? returnDate.toISOString().split('T')[0] : '',
            adults: adults.toString(),
            children: children.toString(),
            cabin: cabinClass,
        });
        window.location.href = `/flights?${params.toString()}`;
    };

    const swapAirports = () => {
        const tempQuery = fromQuery;
        const tempAirport = fromAirport;

        setFromQuery(toQuery);
        setFromAirport(toAirport);

        setToQuery(tempQuery);
        setToAirport(tempAirport);
    };

    const handleAirportSelect = (airport: Airport, type: 'from' | 'to') => {
        if (type === 'from') {
            setFromAirport(airport);
            setFromQuery(`${airport.city} (${airport.code})`);
            setShowFromDropdown(false);
        } else {
            setToAirport(airport);
            setToQuery(`${airport.city} (${airport.code})`);
            setShowToDropdown(false);
        }
        setActiveField(null);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "Add date";
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long' });
    };

    const getNextMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    };

    const isDateSelected = (date: Date) => {
        if (departDate && date.toDateString() === departDate.toDateString()) return "depart";
        if (returnDate && date.toDateString() === returnDate.toDateString()) return "return";
        return null;
    };

    const isDateInRange = (date: Date) => {
        if (!departDate || !returnDate) return false;
        return date > departDate && date < returnDate;
    };

    const handleDateClick = (date: Date) => {
        if (selectingDate === "depart") {
            setDepartDate(date);
            setSelectingDate("return");
            if (returnDate && date >= returnDate) {
                setReturnDate(null);
            }
        } else {
            if (departDate && date < departDate) {
                setDepartDate(date);
            } else {
                setReturnDate(date);
            }
        }
    };

    const renderCalendarMonth = (monthDate: Date) => {
        const daysInMonth = getDaysInMonth(monthDate);
        const firstDay = getFirstDayOfMonth(monthDate);
        const days = [];

        // Empty cells for days before the first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = date < today;
            const selected = isDateSelected(date);
            const inRange = isDateInRange(date);

            days.push(
                <button
                    key={day}
                    onClick={() => !isPast && handleDateClick(date)}
                    disabled={isPast}
                    className={`w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
            ${selected === "depart" ? 'bg-[#0770e3] text-white' : ''}
            ${selected === "return" ? 'bg-[#0770e3] text-white' : ''}
            ${inRange ? 'bg-blue-50' : ''}
            ${!selected && !isPast ? 'text-[#161616]' : ''}
          `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const cabinClasses = ["Economy", "Premium Economy", "Business", "First"];

    return (
        <div className={`w-full max-w-[1000px] mx-auto relative ${className || ''}`}>
            {/* Overlay to close dropdowns */}
            {(showTripTypeDropdown || showFromDropdown || showToDropdown || showCalendar || showTravelers) && (
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
                    <ChevronDown className={`w-4 h-4 transition-transform ${showTripTypeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTripTypeDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 min-w-[150px]">
                        {["Return", "One-way"].map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    setTripType(type);
                                    if (type === "One-way") {
                                        setReturnDate(null);
                                    }
                                    setShowTripTypeDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${tripType === type ? 'text-[#0770e3] font-medium' : 'text-[#161616]'}`}
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
                    <div className={`flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative ${activeField === 'from' ? 'ring-2 ring-[#0770e3] rounded-l-lg z-10' : ''}`}>
                        <div
                            className="w-full flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left cursor-text"
                            onClick={() => {
                                closeAllDropdowns();
                                setShowFromDropdown(true);
                                setActiveField('from');
                            }}
                        >
                            <div className="flex flex-col min-w-0 flex-1">
                                <label className="text-xs text-[#68697f] font-medium block">From</label>
                                <input
                                    type="text"
                                    value={fromQuery}
                                    onChange={(e) => {
                                        setFromQuery(e.target.value);
                                        setFromAirport(null); // Clear specific airport if user types
                                        setShowFromDropdown(true);
                                    }}
                                    onFocus={() => {
                                        closeAllDropdowns();
                                        setShowFromDropdown(true);
                                        setActiveField('from');
                                    }}
                                    className="w-full text-sm font-semibold text-[#161616] truncate bg-transparent outline-none p-0 border-none placeholder-gray-400"
                                    placeholder="Country, city or airport"
                                />
                            </div>
                            {fromQuery && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFromQuery("");
                                        setFromAirport(null);
                                        setActiveField('from');
                                        // Keeping dropdown open to show suggestions
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-4 h-4 text-[#68697f]" />
                                </button>
                            )}
                        </div>

                        {/* From Dropdown */}
                        {showFromDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-[60] w-80 max-h-96 overflow-hidden overflow-y-auto">
                                <div className="py-2">
                                    {isSearchingFrom ? (
                                        <div className="px-4 py-3 text-sm text-[#68697f]">Searching...</div>
                                    ) : fromSuggestions.length > 0 ? (
                                        fromSuggestions.map((airport) => (
                                            <button
                                                key={airport.code}
                                                onClick={() => handleAirportSelect(airport, 'from')}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3"
                                            >
                                                <Plane className="w-5 h-5 text-[#68697f] mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-[#161616]">{airport.city} ({airport.code})</p>
                                                    <p className="text-xs text-[#68697f]">{airport.name}, {airport.country}</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-[#68697f]">No results found</div>
                                    )}
                                </div>
                            </div>
                        )}

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
                    <div className={`flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative ${activeField === 'to' ? 'ring-2 ring-[#0770e3] z-10' : ''}`}>
                        <div
                            className="w-full flex items-start gap-3 px-4 py-4 lg:pl-6 hover:bg-gray-50 transition-colors text-left cursor-text"
                            onClick={() => {
                                closeAllDropdowns();
                                setShowToDropdown(true);
                                setActiveField('to');
                            }}
                        >
                            <div className="flex flex-col min-w-0 flex-1">
                                <label className="text-xs text-[#68697f] font-medium block">To</label>
                                <input
                                    type="text"
                                    value={toQuery}
                                    onChange={(e) => {
                                        setToQuery(e.target.value);
                                        setToAirport(null);
                                        setShowToDropdown(true);
                                    }}
                                    onFocus={() => {
                                        closeAllDropdowns();
                                        setShowToDropdown(true);
                                        setActiveField('to');
                                    }}
                                    className="w-full text-sm font-semibold text-[#161616] truncate bg-transparent outline-none p-0 border-none placeholder-gray-400"
                                    placeholder="Country, city or airport"
                                />
                            </div>
                            {toQuery && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setToQuery("");
                                        setToAirport(null);
                                        setActiveField('to');
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-4 h-4 text-[#68697f]" />
                                </button>
                            )}
                        </div>

                        {/* To Dropdown */}
                        {showToDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-[60] w-72 overflow-hidden overflow-y-auto max-h-96">
                                <div className="py-2">
                                    {isSearchingTo ? (
                                        <div className="px-4 py-3 text-sm text-[#68697f]">Searching...</div>
                                    ) : toSuggestions.length > 0 ? (
                                        toSuggestions.map((airport) => (
                                            <button
                                                key={airport.code}
                                                onClick={() => handleAirportSelect(airport, 'to')}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3"
                                            >
                                                <Plane className="w-5 h-5 text-[#68697f] mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-[#161616]">{airport.city} ({airport.code})</p>
                                                    <p className="text-xs text-[#68697f]">{airport.name}, {airport.country}</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-[#68697f]">No results found</div>
                                    )}

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        onClick={() => { setShowToDropdown(false); setActiveField(null); }}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                    >
                                        <Globe className="w-5 h-5 text-[#0770e3]" />
                                        <span className="text-sm font-medium text-[#0770e3]">Explore everywhere</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Depart Date */}
                    <div className={`flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative ${activeField === 'depart' ? 'ring-2 ring-[#0770e3] z-10' : ''}`}>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                closeAllDropdowns();
                                setShowCalendar(true);
                                setSelectingDate("depart");
                                setActiveField('depart');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    closeAllDropdowns();
                                    setShowCalendar(true);
                                    setSelectingDate("depart");
                                    setActiveField('depart');
                                }
                            }}
                            className="w-full flex items-start justify-between px-4 py-4 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs text-[#68697f] font-medium">Depart</span>
                                <span className="text-sm font-semibold text-[#161616]">{formatDate(departDate)}</span>
                            </div>
                            {activeField === 'depart' && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); closeAllDropdowns(); }}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-4 h-4 text-[#68697f]" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Return Date - Only show if not One-way */}
                    {tripType !== "One-way" ? (
                        <div className={`flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative ${activeField === 'return' ? 'ring-2 ring-[#0770e3] z-10' : ''}`}>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    closeAllDropdowns();
                                    setShowCalendar(true);
                                    setSelectingDate("return");
                                    setActiveField('return');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        closeAllDropdowns();
                                        setShowCalendar(true);
                                        setSelectingDate("return");
                                        setActiveField('return');
                                    }
                                }}
                                className={`w-full flex items-start justify-between px-4 py-4 hover:bg-gray-50 transition-colors text-left cursor-pointer ${!returnDate ? 'text-[#68697f]' : ''}`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs text-[#68697f] font-medium">Return</span>
                                    <span className={`text-sm font-semibold ${returnDate ? 'text-[#161616]' : 'text-[#68697f]'}`}>
                                        {formatDate(returnDate)}
                                    </span>
                                </div>
                                {activeField === 'return' ? (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); closeAllDropdowns(); }}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="w-4 h-4 text-[#68697f]" />
                                    </button>
                                ) : returnDate ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setReturnDate(null);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="w-4 h-4 text-[#68697f]" />
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        // Hidden Placeholder for One-way to maintain some spacing if needed, or simply not render
                        null
                    )}

                    {/* Travelers */}
                    <div className={`flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative ${activeField === 'travelers' ? 'ring-2 ring-[#0770e3] z-10' : ''}`}>
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowTravelers(true);
                                setActiveField('travelers');
                            }}
                            className="w-full flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs text-[#68697f] font-medium">Travellers and cabin class</span>
                                <span className="text-sm font-semibold text-[#161616]">
                                    {adults + children} {adults + children === 1 ? 'Adult' : 'Travellers'}, {cabinClass}
                                </span>
                            </div>
                        </button>

                        {/* Travelers Dropdown */}
                        {showTravelers && (
                            <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[60] p-5 w-80">
                                <div className="mb-4">
                                    <label className="text-sm font-semibold text-[#161616] mb-2 block">Cabin class</label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowCabinDropdown(!showCabinDropdown)}
                                            className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-sm"
                                        >
                                            <span>{cabinClass}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showCabinDropdown ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showCabinDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-[70] py-1">
                                                {cabinClasses.map((cls) => (
                                                    <button
                                                        key={cls}
                                                        onClick={() => { setCabinClass(cls); setShowCabinDropdown(false); }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${cabinClass === cls ? 'text-[#0770e3] font-medium' : 'text-[#161616]'}`}
                                                    >
                                                        {cls}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-[#161616]">Adults</p>
                                        <p className="text-xs text-[#68697f]">Aged 18+</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setAdults(Math.max(1, adults - 1))}
                                            disabled={adults <= 1}
                                            className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center disabled:opacity-40 hover:bg-gray-200 transition-colors"
                                        >
                                            <Minus className="w-4 h-4 text-[#161616]" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-semibold">{adults}</span>
                                        <button
                                            onClick={() => setAdults(Math.min(9, adults + 1))}
                                            disabled={adults >= 9}
                                            className="w-8 h-8 rounded-md bg-[#0770e3] flex items-center justify-center disabled:opacity-40 hover:bg-[#0560c2] transition-colors"
                                        >
                                            <Plus className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-[#161616]">Children</p>
                                        <p className="text-xs text-[#68697f]">Aged 0 to 17</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setChildren(Math.max(0, children - 1))}
                                            disabled={children <= 0}
                                            className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center disabled:opacity-40 hover:bg-gray-200 transition-colors"
                                        >
                                            <Minus className="w-4 h-4 text-[#161616]" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-semibold">{children}</span>
                                        <button
                                            onClick={() => setChildren(Math.min(9, children + 1))}
                                            disabled={children >= 9}
                                            className="w-8 h-8 rounded-md bg-[#0770e3] flex items-center justify-center disabled:opacity-40 hover:bg-[#0560c2] transition-colors"
                                        >
                                            <Plus className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-[#68697f] leading-relaxed">
                                        Your age at time of travel must be valid for the age category booked. Airlines have restrictions on under 18s travelling alone.
                                    </p>
                                    <p className="text-xs text-[#68697f] leading-relaxed mt-2">
                                        Age limits and policies for travelling with children may vary so please check with the airline before booking.
                                    </p>
                                </div>

                                <button
                                    onClick={() => { setShowTravelers(false); setActiveField(null); }}
                                    className="w-full mt-4 py-3 bg-[#0770e3] text-white rounded-lg text-sm font-semibold hover:bg-[#0560c2] transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
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

            {/* Calendar Dropdown - OUTSIDE the search card for proper positioning */}
            {showCalendar && (
                <div className="absolute left-0 right-0 top-[120px] flex justify-center z-[60]">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-5 w-[600px]">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowTripTypeDropdown(!showTripTypeDropdown)}
                                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                >
                                    {tripType}
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tabs */}

                        </div>

                        {/* Calendar */}
                        <div className="flex gap-8">
                            {/* Month 1 */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-[#68697f]" />
                                    </button>
                                    <h3 className="text-base font-semibold text-[#161616]">{getMonthName(calendarMonth)}</h3>
                                    <div className="w-7"></div>
                                </div>

                                {/* Day headers */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                        <div key={i} className="w-9 h-6 flex items-center justify-center text-xs text-[#68697f] font-medium">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Days */}
                                <div className="grid grid-cols-7 gap-1">
                                    {renderCalendarMonth(calendarMonth)}
                                </div>
                            </div>

                            {/* Month 2 */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-7"></div>
                                    <h3 className="text-base font-semibold text-[#161616]">{getMonthName(getNextMonth(calendarMonth))}</h3>
                                    <button
                                        onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <ChevronRight className="w-5 h-5 text-[#68697f]" />
                                    </button>
                                </div>

                                {/* Day headers */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                        <div key={i} className="w-9 h-6 flex items-center justify-center text-xs text-[#68697f] font-medium">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Days */}
                                <div className="grid grid-cols-7 gap-1">
                                    {renderCalendarMonth(getNextMonth(calendarMonth))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <span className="text-sm text-[#68697f]">Search for return</span>
                            <button
                                onClick={() => { setShowCalendar(false); setActiveField(null); }}
                                className="px-6 py-2.5 bg-[#0770e3] text-white rounded-lg text-sm font-semibold hover:bg-[#0560c2] transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Options Row */}
            <div className="flex flex-wrap items-center justify-between mt-4">
                <div className="flex flex-wrap items-center gap-4 text-white">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <div
                            onClick={() => setAddNearbyFrom(!addNearbyFrom)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${addNearbyFrom ? "bg-white border-white" : "border-white/50 bg-transparent"}`}
                        >
                            {addNearbyFrom && <Check className="w-3 h-3 text-[#05203c]" />}
                        </div>
                        <span className="text-sm">Add nearby airports</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <div
                            onClick={() => setAddNearbyTo(!addNearbyTo)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${addNearbyTo ? "bg-white border-white" : "border-white/50 bg-transparent"}`}
                        >
                            {addNearbyTo && <Check className="w-3 h-3 text-[#05203c]" />}
                        </div>
                        <span className="text-sm">Add nearby airports</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <div
                            onClick={() => setDirectFlights(!directFlights)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${directFlights ? "bg-white border-white" : "border-white/50 bg-transparent"}`}
                        >
                            {directFlights && <Check className="w-3 h-3 text-[#05203c]" />}
                        </div>
                        <span className="text-sm">Direct flights</span>
                    </label>
                </div>

                {/* Add Hotel */}
                <label className="flex items-center gap-2 cursor-pointer text-white mt-2 lg:mt-0">
                    <div
                        onClick={() => setAddHotel(!addHotel)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${addHotel ? "bg-[#00a698]" : "border border-white/50 bg-transparent"}`}
                    >
                        {addHotel && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm font-medium">Add a hotel</span>
                </label>
            </div>
        </div>
    );
}
