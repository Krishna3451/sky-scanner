"use client";

import { useState } from "react";
import { Users, ChevronDown, Minus, Plus } from "lucide-react";

interface TravelersSelectorProps {
    onClose?: () => void;
}

const cabinClasses = [
    "Economy",
    "Premium Economy",
    "Business",
    "First",
];

export default function TravelersSelector({ onClose }: TravelersSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [cabinClass, setCabinClass] = useState("Economy");

    const totalTravelers = adults + children + infants;
    const displayText = `${totalTravelers} ${totalTravelers === 1 ? "Adult" : "Travellers"}, ${cabinClass}`;

    const CounterButton = ({
        value,
        onChange,
        min = 0,
        max = 9,
        label,
        sublabel,
    }: {
        value: number;
        onChange: (val: number) => void;
        min?: number;
        max?: number;
        label: string;
        sublabel: string;
    }) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
                <p className="text-sm font-medium text-[#161616]">{label}</p>
                <p className="text-xs text-[#68697f]">{sublabel}</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0770e3] transition-colors"
                >
                    <Minus className="w-4 h-4 text-[#0770e3]" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{value}</span>
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0770e3] transition-colors"
                >
                    <Plus className="w-4 h-4 text-[#0770e3]" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left min-w-[160px]"
            >
                <div className="flex-shrink-0">
                    <Users className="w-5 h-5 text-[#68697f]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-[#68697f] font-medium">Travellers and cabin class</span>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-[#161616]">{displayText}</span>
                        <ChevronDown className="w-4 h-4 text-[#68697f]" />
                    </div>
                </div>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4">
                        <h3 className="text-sm font-semibold text-[#161616] mb-3">
                            Travellers
                        </h3>

                        <CounterButton
                            label="Adults"
                            sublabel="16+ years"
                            value={adults}
                            onChange={setAdults}
                            min={1}
                        />
                        <CounterButton
                            label="Children"
                            sublabel="1-16 years"
                            value={children}
                            onChange={setChildren}
                        />
                        <CounterButton
                            label="Infants"
                            sublabel="Under 1 year"
                            value={infants}
                            onChange={setInfants}
                        />

                        <h3 className="text-sm font-semibold text-[#161616] mt-4 mb-3">
                            Cabin class
                        </h3>
                        <div className="space-y-2">
                            {cabinClasses.map((cls) => (
                                <label
                                    key={cls}
                                    className="flex items-center gap-3 cursor-pointer py-2"
                                >
                                    <input
                                        type="radio"
                                        name="cabinClass"
                                        checked={cabinClass === cls}
                                        onChange={() => setCabinClass(cls)}
                                        className="w-4 h-4 text-[#0770e3] focus:ring-[#0770e3]"
                                    />
                                    <span className="text-sm text-[#161616]">{cls}</span>
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full mt-4 py-3 bg-[#0770e3] text-white rounded-lg text-sm font-semibold hover:bg-[#0560c2] transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
