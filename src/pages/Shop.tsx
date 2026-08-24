import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { Filter, ChevronDown, LayoutGrid, Square, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setLoadError(false);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    };

    const categories = useMemo(
        () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
        [products]
    );

    const visibleProducts = useMemo(
        () => categoryFilter === 'all' ? products : products.filter((p) => p.category === categoryFilter),
        [products, categoryFilter]
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Shop Hero - Inspired by Screenshot 2 */}
            <section className="relative h-[60vh] w-full pt-20">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img
                    src="/banner.jpg"
                    alt="Shop Collection"
                    className="absolute inset-0 w-full h-full object-cover brightness-75"
                />
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6">
                    <h1 className="text-4xl md:text-6xl tracking-[0.4em] font-serif mb-4">Handbags for Women</h1>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80 max-w-2xl leading-loose">
                        A curation of raw beauty, traditional craftsmanship, and modern silhouettes.
                    </p>
                </div>
            </section>

            {/* Filter & View Toolbar */}
            <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-8 relative">
                        <button
                            onClick={() => setFilterOpen((v) => !v)}
                            className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] font-bold group"
                        >
                            <Filter className="w-4 h-4" />
                            <span>{categoryFilter === 'all' ? 'Filter By' : categoryFilter}</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </button>

                        {filterOpen && (
                            <div className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-lg py-2 min-w-[180px] z-40">
                                <button
                                    onClick={() => { setCategoryFilter('all'); setFilterOpen(false); }}
                                    className={cn(
                                        "block w-full text-left px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-offwhite transition-colors",
                                        categoryFilter === 'all' && "text-black", categoryFilter !== 'all' && "text-gray-400"
                                    )}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => { setCategoryFilter(cat); setFilterOpen(false); }}
                                        className={cn(
                                            "block w-full text-left px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-offwhite transition-colors",
                                            categoryFilter === cat && "text-black", categoryFilter !== cat && "text-gray-400"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-8 text-[10px] uppercase tracking-[0.3em] font-bold">
                        <div className="hidden md:flex items-center space-x-4 border-r border-gray-100 pr-8 mr-4">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn("transition-opacity", viewMode === 'grid' ? "opacity-100" : "opacity-30")}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('large')}
                                className={cn("transition-opacity", viewMode === 'large' ? "opacity-100" : "opacity-30")}
                            >
                                <Square className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="text-gray-400">{visibleProducts.length} Products</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-6 h-6 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : loadError ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <AlertCircle className="w-10 h-10 text-gray-300 mb-6" />
                        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 mb-8 italic">
                            Unable to load the collection right now. Please try again shortly.
                        </p>
                        <button
                            onClick={fetchProducts}
                            className="flex items-center space-x-3 px-8 py-4 border border-black uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all"
                        >
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry</span>
                        </button>
                    </div>
                ) : (
                    <div className={cn(
                        "grid gap-x-6 gap-y-16",
                        viewMode === 'grid'
                            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            : "grid-cols-1 md:grid-cols-2"
                    )}>
                        {visibleProducts.map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="group flex flex-col items-center"
                            >
                                <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-brand-offwhite w-full border border-gray-50">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 transition-all"
                                    />
                                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/[0.02] transition-colors" />

                                    {/* Hover Quick Add */}
                                    <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <button className="bg-black text-white py-3 px-8 uppercase text-[9px] tracking-[0.3em] font-bold shadow-xl hover:bg-brand-accent transition-colors">
                                            Quick View
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center px-2">
                                    <h3 className="text-[10px] tracking-[0.2em] uppercase mb-2 font-bold leading-tight min-h-[2.5em] flex items-center">
                                        {product.name}
                                    </h3>
                                    <p className="text-[12px] tracking-[0.1em] font-serif italic text-gray-500">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && !loadError && visibleProducts.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 italic">No pieces in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper inside the file since it's used once
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default Shop;
