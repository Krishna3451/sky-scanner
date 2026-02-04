"use client";

import { Calendar } from "lucide-react";

interface DatePickerProps {
    label: string;
    value?: string;
    placeholder?: string;
    onClick?: () => void;
}

export default function DatePicker({
    label,
    value,
    placeholder = "Add date",
    onClick,
}: DatePickerProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left min-w-[140px]"
        >
            <div className="flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#68697f]" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-[#68697f] font-medium">{label}</span>
                <span className={`text-sm font-medium ${value ? "text-[#161616]" : "text-[#0770e3]"}`}>
                    {value || placeholder}
                </span>
            </div>
        </button>
    );
}
