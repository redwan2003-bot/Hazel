import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 py-4 md:px-12 md:py-6 flex items-center justify-between",
            isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3 md:py-4" : "bg-transparent py-6 md:py-8"
        )}>
            {/* Left: Nav Links */}
            <div className="flex items-center space-x-10">
                <button className="lg:hidden">
                    <Menu className={cn("w-5 h-5 transition-colors", isScrolled ? "text-black" : "text-white")} />
                </button>
                <div className="hidden lg:flex items-center space-x-10">
                    <Link to="/shop" className={cn(
                        "text-[10px] uppercase tracking-[0.4em] font-bold hover:opacity-50 transition-all",
                        isScrolled ? "text-black" : "text-white"
                    )}>
                        Creations
                    </Link>
                </div>
            </div>

            {/* Center: Brand Identity */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                <div className="relative h-10 md:h-14 overflow-hidden mb-1">
                    <img
                        src="/logo.jpg"
                        alt="HAZEL Logo"
                        className="h-full w-auto object-contain transition-all duration-700"
                    />
                </div>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center space-x-6 md:space-x-8">
                <button className={cn("hover:opacity-50 transition-all", isScrolled ? "text-black" : "text-white")}>
                    <Search className="w-5 h-5 stroke-[1.5]" />
                </button>
                <Link to="/admin" className={cn("hidden md:block hover:opacity-50 transition-all", isScrolled ? "text-black" : "text-white")}>
                    <User className="w-5 h-5 stroke-[1.5]" />
                </Link>
                <Link to="/cart" className="relative group">
                    <ShoppingBag className={cn(
                        "w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform",
                        isScrolled ? "text-black" : "text-white"
                    )} />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
