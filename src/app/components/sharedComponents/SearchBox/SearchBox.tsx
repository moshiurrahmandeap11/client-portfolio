import { useEffect, useState } from "react";
import { MdOutlineWindow, MdClose, MdSearch } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

interface SearchItem {
    label: string;
    href: string;
    description?: string;
}

const SearchBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Search items data
    const searchItems: SearchItem[] = [
        { label: "Home", href: "/", description: "Go to homepage" },
        { label: "Blogs", href: "/blogs", description: "Read our blog posts" },
        { label: "Projects", href: "/projects", description: "View my projects" },
        { label: "Contact", href: "/contact", description: "Get in touch" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/moshiurrahmandeap", description: "Connect on LinkedIn" },
        { label: "GitHub", href: "https://github.com/moshiurrahmandeap11", description: "Check my GitHub" },
    ];

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }

            if (e.key === "Escape") {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // Filter items based on search
    const filteredItems = searchItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClose = () => {
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div>
            {/* Search Trigger Button */}
            <div className="relative group">
                <div className="flex text-base items-center gap-1 group-hover:text-white transition-all duration-200 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MdOutlineWindow className="text-sm" />
                    <span className="text-xs font-medium">K</span>
                </div>
                <input
                    type="text"
                    placeholder="Search... "
                    onClick={() => setIsOpen(true)}
                    readOnly
                    className="px-4 py-1.5 pr-12 rounded-lg placeholder:text-gray-400 placeholder:font-medium placeholder:text-sm group-hover:placeholder:text-white bg-black/80 border border-gray-700 text-gray-300 outline-none transition-all duration-200 cursor-pointer w-40"
                />
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
                    onClick={handleClose}
                >
                    {/* Backdrop with blur */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fadeIn" />

                    {/* Modal Content */}
                    <div
                        className="relative w-full max-w-lg mx-4 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="relative border-b border-gray-700/50">
                            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search sections..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder:text-gray-500 outline-none text-base"
                            />
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                <MdClose className="text-xl" />
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="max-h-64 overflow-y-auto p-2">
                            {filteredItems.length > 0 ? (
                                <ul className="space-y-1">
                                    {filteredItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                                onClick={handleClose}
                                                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group/item"
                                            >
                                                <div>
                                                    <p className="text-white font-medium text-sm group-hover/item:text-orange-400 transition-colors">
                                                        {item.label}
                                                    </p>
                                                    {item.description && (
                                                        <p className="text-gray-500 text-xs mt-0.5">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <FiArrowRight className="text-gray-600 group-hover/item:text-orange-400 group-hover/item:translate-x-1 transition-all text-sm" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8">
                                    <MdSearch className="text-gray-600 text-3xl mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No results found</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-700/50 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                    <MdOutlineWindow className="text-sm" />
                                    <span>K</span>
                                </span>
                                <span>to open</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>↑↓ Navigate</span>
                                <span>↵ Open</span>
                                <span>Esc Close</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBox;