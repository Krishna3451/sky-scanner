"use client";

import { MapPin } from "lucide-react";

interface AirportInputProps {
    label: string;
    value: string;
    code?: string;
    placeholder?: string;
    onClick?: () => void;
}

export default function AirportInput({
    label,
    value,
    code,
    placeholder = "Add location",
    onClick,
}: AirportInputProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left min-w-[180px] flex-1"
        >
            <div className="flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#68697f]" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-[#68697f] font-medium">{label}</span>
                <span className="text-sm font-medium text-[#161616]">
                    {value || placeholder}
                    {code && (
                        <span className="text-[#68697f] ml-1">({code})</span>
                    )}
                </span>
            </div>
        </button>
    );
}
