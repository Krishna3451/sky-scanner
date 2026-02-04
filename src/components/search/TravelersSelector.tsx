"use client";

import { useState, useCallback } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { CABIN_CLASSES, CabinClass } from "@/constants/airports";

interface TravelersSelectorProps {
    adults: number;
    children: number;
    cabinClass: string;
    onAdultsChange: (value: number) => void;
    onChildrenChange: (value: number) => void;
    onCabinChange: (value: string) => void;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}

export default function TravelersSelector({
    adults,
    children,
    cabinClass,
    onAdultsChange,
    onChildrenChange,
    onCabinChange,
    isOpen,
    onToggle,
    onClose,
}: TravelersSelectorProps) {
    const [showCabinDropdown, setShowCabinDropdown] = useState(false);

    const displayText = `${adults + children} ${adults + children === 1 ? "Adult" : "Travellers"
        }, ${cabinClass}`;

    return (
        <div className="relative flex-1">
            <button
                onClick={onToggle}
                className="w-full flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
            >
                <div className="flex flex-col">
                    <span className="text-xs text-[#68697f] font-medium">
                        Travellers and cabin class
                    </span>
                    <span className="text-sm font-semibold text-[#161616]">{displayText}</span>
                </div>
            </button>

            {/* Travelers Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[60] p-5 w-80">
                    <div className="mb-4">
                        <label className="text-sm font-semibold text-[#161616] mb-2 block">
                            Cabin class
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setShowCabinDropdown(!showCabinDropdown)}
                                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-sm"
                            >
                                <span>{cabinClass}</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${showCabinDropdown ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {showCabinDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-[70] py-1">
                                    {CABIN_CLASSES.map((cls) => (
                                        <button
                                            key={cls}
                                            onClick={() => {
                                                onCabinChange(cls);
                                                setShowCabinDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${cabinClass === cls
                                                    ? "text-[#0770e3] font-medium"
                                                    : "text-[#161616]"
                                                }`}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <CounterRow
                        label="Adults"
                        sublabel="Aged 18+"
                        value={adults}
                        onChange={onAdultsChange}
                        min={1}
                        max={9}
                    />

                    <CounterRow
                        label="Children"
                        sublabel="Aged 0 to 17"
                        value={children}
                        onChange={onChildrenChange}
                        min={0}
                        max={9}
                    />

                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-[#68697f] leading-relaxed">
                            Your age at time of travel must be valid for the age category booked.
                            Airlines have restrictions on under 18s travelling alone.
                        </p>
                        <p className="text-xs text-[#68697f] leading-relaxed mt-2">
                            Age limits and policies for travelling with children may vary so
                            please check with the airline before booking.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-4 py-3 bg-[#0770e3] text-white rounded-lg text-sm font-semibold hover:bg-[#0560c2] transition-colors"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}

interface CounterRowProps {
    label: string;
    sublabel: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
}

function CounterRow({ label, sublabel, value, onChange, min, max }: CounterRowProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-semibold text-[#161616]">{label}</p>
                <p className="text-xs text-[#68697f]">{sublabel}</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center disabled:opacity-40 hover:bg-gray-200 transition-colors"
                >
                    <Minus className="w-4 h-4 text-[#161616]" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{value}</span>
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className="w-8 h-8 rounded-md bg-[#0770e3] flex items-center justify-center disabled:opacity-40 hover:bg-[#0560c2] transition-colors"
                >
                    <Plus className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
}
