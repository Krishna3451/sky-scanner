import { ChevronDown, ChevronRight, Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#05203c] text-white">
            {/* Main Footer Content */}
            <div className="max-w-[1200px] mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Region/Language Column */}
                    <div>
                        <button className="flex items-center gap-2 text-sm font-medium mb-6 bg-[#1a4166] px-4 py-2 rounded-lg hover:bg-[#2a5176] transition-colors">
                            <Globe className="w-4 h-4" />
                            <span>India</span>
                            <span className="text-white/60">·</span>
                            <span>English (UK)</span>
                            <span className="text-white/60">·</span>
                            <span>₹ INR</span>
                        </button>
                    </div>

                    {/* Help Column */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Help</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                                    Privacy Settings
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                                    Log in
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Cookie Policy Column */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Cookie policy</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                                    Privacy policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                                    Terms of service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                                    Company Details
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Explore Column */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold mb-4">Explore</h4>
                        <div className="grid grid-cols-2 gap-x-6">
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors flex items-center justify-between">
                                        Company
                                        <ChevronRight className="w-4 h-4" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors flex items-center justify-between">
                                        Partners
                                        <ChevronRight className="w-4 h-4" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors flex items-center justify-between">
                                        Trips
                                        <ChevronRight className="w-4 h-4" />
                                    </a>
                                </li>
                            </ul>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors flex items-center justify-between">
                                        International Sites
                                        <ChevronRight className="w-4 h-4" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-[1200px] mx-auto px-4 py-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <p className="text-xs text-white/60 max-w-2xl">
                            Cheap flight booking from anywhere, to everywhere
                        </p>
                        <p className="text-sm text-white/60">
                            © Skyscanner Ltd 2002 - 2026
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
