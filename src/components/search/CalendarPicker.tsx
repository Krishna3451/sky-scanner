"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";

interface CalendarPickerProps {
    departDate: Date | null;
    returnDate: Date | null;
    tripType: "Return" | "One-way";
    onDepartChange: (date: Date) => void;
    onReturnChange: (date: Date | null) => void;
    onTripTypeChange: (type: "Return" | "One-way") => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function CalendarPicker({
    departDate,
    returnDate,
    tripType,
    onDepartChange,
    onReturnChange,
    onTripTypeChange,
    isOpen,
    onClose,
}: CalendarPickerProps) {
    const [calendarMonth, setCalendarMonth] = useState(departDate || new Date());
    const [selectingDate, setSelectingDate] = useState<"depart" | "return">("depart");
    const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
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

    const handleDateClick = useCallback(
        (date: Date) => {
            if (selectingDate === "depart") {
                onDepartChange(date);
                setSelectingDate("return");
                if (returnDate && date >= returnDate) {
                    onReturnChange(null);
                }
            } else {
                if (departDate && date < departDate) {
                    onDepartChange(date);
                } else {
                    onReturnChange(date);
                }
            }
        },
        [selectingDate, departDate, returnDate, onDepartChange, onReturnChange]
    );

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
            ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}
            ${selected === "depart" ? "bg-[#0770e3] text-white" : ""}
            ${selected === "return" ? "bg-[#0770e3] text-white" : ""}
            ${inRange ? "bg-blue-50" : ""}
            ${!selected && !isPast ? "text-[#161616]" : ""}
          `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    if (!isOpen) return null;

    return (
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
                        {showTripTypeDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 min-w-[120px]">
                                {(["Return", "One-way"] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            onTripTypeChange(type);
                                            if (type === "One-way") onReturnChange(null);
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
                </div>

                {/* Calendar */}
                <div className="flex gap-8">
                    {/* Month 1 */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() =>
                                    setCalendarMonth(
                                        new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
                                    )
                                }
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#68697f]" />
                            </button>
                            <h3 className="text-base font-semibold text-[#161616]">
                                {getMonthName(calendarMonth)}
                            </h3>
                            <div className="w-7"></div>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                                <div
                                    key={i}
                                    className="w-9 h-6 flex items-center justify-center text-xs text-[#68697f] font-medium"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days */}
                        <div className="grid grid-cols-7 gap-1">{renderCalendarMonth(calendarMonth)}</div>
                    </div>

                    {/* Month 2 */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-7"></div>
                            <h3 className="text-base font-semibold text-[#161616]">
                                {getMonthName(getNextMonth(calendarMonth))}
                            </h3>
                            <button
                                onClick={() =>
                                    setCalendarMonth(
                                        new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
                                    )
                                }
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronRight className="w-5 h-5 text-[#68697f]" />
                            </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                                <div
                                    key={i}
                                    className="w-9 h-6 flex items-center justify-center text-xs text-[#68697f] font-medium"
                                >
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
                    <span className="text-sm text-[#68697f]">
                        {selectingDate === "depart" ? "Select departure date" : "Select return date"}
                    </span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-[#0770e3] text-white rounded-lg text-sm font-semibold hover:bg-[#0560c2] transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper function to format date for display
export function formatDate(date: Date | null): string {
    if (!date) return "Add date";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}
