"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface AccordionItem {
    question: string;
    answer: string;
}

interface AccordionProps {
    items: AccordionItem[];
    columns?: 1 | 2;
}

function AccordionItemComponent({ item }: { item: AccordionItem }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-2 flex items-center justify-between text-left group"
            >
                <span className="text-sm text-[#161616] pr-4">
                    {item.question}
                </span>
                {isOpen ? (
                    <Check className="w-4 h-4 text-[#0770e3] flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-[#68697f] flex-shrink-0" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-3" : "max-h-0"
                    }`}
            >
                <p className="text-sm text-[#68697f] leading-relaxed">{item.answer}</p>
            </div>
        </div>
    );
}

export default function Accordion({ items, columns = 1 }: AccordionProps) {
    if (columns === 2) {
        const midpoint = Math.ceil(items.length / 2);
        const leftColumn = items.slice(0, midpoint);
        const rightColumn = items.slice(midpoint);

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                <div>
                    {leftColumn.map((item, index) => (
                        <AccordionItemComponent key={index} item={item} />
                    ))}
                </div>
                <div>
                    {rightColumn.map((item, index) => (
                        <AccordionItemComponent key={index} item={item} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            {items.map((item, index) => (
                <AccordionItemComponent key={index} item={item} />
            ))}
        </div>
    );
}
