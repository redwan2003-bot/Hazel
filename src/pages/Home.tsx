import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { formatPrice } from '../lib/utils';

const Home = () => {
    // Expanded featured bags for the landing page (8 items)
    const featuredBags = [
        { id: '1', name: 'Hazel Suede Sachel', price: 6500, image_url: '/bag1.jpg', category: 'NEW SEASON' },
        { id: '2', name: 'Classic Leather Tote', price: 7200, image_url: '/bag2.jpg', category: 'EDITOR\'S PICK' },
        { id: '3', name: 'Mini Crossbody Noir', price: 4800, image_url: '/bag3.jpg', category: 'LATEST' },
        { id: '4', name: 'Elegant Evening Clutch', price: 5500, image_url: '/bag4.jpg', category: 'TRENDING' },
        { id: '6', name: 'Signature Handbag', price: 8500, image_url: '/bag6.jpg', category: 'HERITAGE' },
        { id: '15', name: 'Heritage Leather Satchel', price: 8200, image_url: '/bag15.jpg', category: 'THE VAULT' },
        { id: '8', name: 'Daily Essential Tote', price: 6800, image_url: '/bag8.jpg', category: 'MUST HAVE' },
        { id: '11', name: 'Modern Satchel Green', price: 6200, image_url: '/bag11.jpg', category: 'NEW ARRIVAL' }
    ];

    return (
        <div className="flex flex-col bg-white overflow-hidden">
            {/* Reduced Hero Section - Matching Shop Style */}
            <section className="relative h-[70vh] w-full overflow-hidden pt-20">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img
                    src="/banner.jpg"
                    alt="THE HAZEL Hero"
                    className="absolute inset-0 w-full h-full object-cover brightness-75 animate-subtle-zoom"
                />
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6">
                    <span className="text-[10px] tracking-[0.8em] uppercase mb-4 opacity-70">Spring Summer 2026</span>
                    <h1 className="text-4xl md:text-7xl tracking-[0.3em] font-serif mb-8 animate-fade-in uppercase">THE HAZEL</h1>
                    <p className="text-xs md:text-sm uppercase tracking-[0.4em] max-w-lg leading-relaxed opacity-80 mb-10 italic font-serif">
                        Raw beauty and everyday elegance.
                    </p>
                    <Link
                        to="/shop"
                        className="group flex items-center space-x-6 border border-white/40 px-10 py-4 uppercase text-[9px] tracking-[0.5em] font-bold hover:bg-white hover:text-black transition-all duration-700"
                    >
                        <span>Enter the Vault</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Editorial Showcase - Updated Image to banner_2.jpg */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2 relative group overflow-hidden bg-brand-offwhite">
                        <img
                            src="/bag9.jpg"
                            alt="The Artisan Narrative"
                            className="w-full h-[60vh] object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 border border-white/10 m-6" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col items-start text-left space-y-8">
                        <span className="text-[9px] tracking-[0.5em] text-gray-400 uppercase font-bold text-center w-full md:text-left">The Artisan Narrative</span>
                        <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight">Crafted for the <br /> Unspoken Strengths</h2>
                        <p className="text-gray-500 font-serif italic text-lg leading-loose max-w-md">
                            "A Hazel bag isn't just an accessory; it's a piece of quiet rebellion against the ordinary. Raw materials meeting refined hands."
                        </p>
                        <Link to="/shop" className="text-[10px] uppercase tracking-[0.5em] font-bold border-b border-black pb-2 hover:opacity-50 transition-opacity">
                            Discover the Process
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Collection Grid - Expanded to 8 products */}
            <section className="py-32 px-6 md:px-12 bg-brand-offwhite/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 flex flex-col items-center">
                        <h2 className="text-xs uppercase tracking-[0.6em] font-bold mb-6 text-gray-400">Featured Creations</h2>
                        <div className="h-px w-12 bg-gray-200 mb-8" />
                        <h3 className="text-4xl md:text-5xl font-serif italic tracking-tight">The Modern Heritage</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                        {featuredBags.map((bag) => (
                            <Link key={bag.id} to={`/product/${bag.id}`} className="group flex flex-col items-center">
                                <div className="relative overflow-hidden aspect-[4/5] mb-8 bg-white w-full border border-gray-100">
                                    <img
                                        src={bag.image_url}
                                        alt={bag.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[8px] tracking-[0.2em] font-bold uppercase border border-gray-100">
                                        {bag.category}
                                    </div>
                                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/[0.02] transition-colors" />
                                </div>
                                <h3 className="text-[10px] tracking-[0.2em] uppercase mb-2 font-bold text-center leading-tight h-8 flex items-center">
                                    {bag.name}
                                </h3>
                                <p className="text-[12px] font-serif italic text-gray-500">
                                    {formatPrice(bag.price)}
                                </p>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                        <Link
                            to="/shop"
                            className="inline-block px-16 py-6 border border-black uppercase text-[10px] tracking-[0.4em] font-bold hover:bg-black hover:text-white transition-all duration-500 shadow-sm"
                        >
                            View Entire Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Statement Section */}
            <section className="bg-white py-32 px-6 md:px-12">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <span className="text-[9px] tracking-[0.8em] text-gray-400 uppercase font-bold">Hazel Philosophy</span>
                    <h2 className="text-3xl md:text-5xl font-serif italic leading-snug text-gray-800">
                        "We believe in the beauty of simplicity and the power of heritage. Each piece is a conversation."
                    </h2>
                    <div className="flex justify-center space-x-12 pt-8">
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-serif">100%</span>
                            <span className="text-[8px] tracking-[0.3em] uppercase text-gray-400 mt-2 font-bold">Natural Leather</span>
                        </div>
                        <div className="h-12 w-px bg-gray-200" />
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-serif">Hand</span>
                            <span className="text-[8px] tracking-[0.3em] uppercase text-gray-400 mt-2 font-bold">Stitched Detail</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
