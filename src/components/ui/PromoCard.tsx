import { LucideIcon } from "lucide-react";

interface PromoCardProps {
    icon: LucideIcon;
    title: string;
    color?: string;
    href?: string;
}

export default function PromoCard({
    icon: Icon,
    title,
    color = "#0770e3",
    href = "#",
}: PromoCardProps) {
    return (
        <a
            href={href}
            className="group block rounded-xl p-5 transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: color }}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                    {title}
                </h3>
            </div>
        </a>
    );
}
