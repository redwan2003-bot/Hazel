import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../lib/useCart';
import { formatPrice } from '../lib/utils';
import { Plus, Minus, ShoppingBag, Heart, Share2 } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [openSection, setOpenSection] = useState<string | null>('description');
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        fetchProduct();
        fetchRelated();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .neq('id', id)
                .limit(4);
            if (error) throw error;
            setRelatedProducts(data || []);
        } catch (error) {
            console.error('Error fetching related:', error);
            setRelatedProducts([]);
        }
    };

    const handleAddToBag = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            navigate('/cart');
        }
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    if (loading) return (
        <div className="pt-40 flex justify-center h-screen bg-white">
            <div className="w-6 h-6 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="pt-40 text-center h-screen bg-white">
            <h2 className="text-2xl font-serif tracking-[0.2em] mb-4 uppercase">Creation Not Found</h2>
            <button onClick={() => navigate('/shop')} className="text-xs uppercase tracking-widest border-b border-black pb-1">Back to Collection</button>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-32">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Visual Showcase - Sticky Image */}
                    <div className="lg:w-3/5">
                        <div className="bg-brand-offwhite aspect-[4/5] overflow-hidden sticky top-32">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover grayscale-[5%] hover:grayscale-0 transition-all duration-1000"
                            />
                        </div>
                    </div>

                    {/* Editorial Details */}
                    <div className="lg:w-2/5 flex flex-col pt-0 lg:pt-10">
                        <div className="mb-12">
                            <h1 className="text-2xl md:text-4xl tracking-[0.2em] font-serif uppercase mb-6">{product.name}</h1>
                            <p className="text-xl font-serif italic text-gray-500 mb-8">{formatPrice(product.price)}</p>

                            <div className="flex items-center space-x-6 mb-12">
                                <div className="flex items-center border border-gray-100 py-3 px-6 bg-brand-offwhite">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-gray-400"><Minus className="w-3 h-3" /></button>
                                    <span className="mx-8 text-xs font-bold tracking-widest">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="hover:text-gray-400"><Plus className="w-3 h-3" /></button>
                                </div>
                                <button className="p-4 border border-gray-100 hover:bg-brand-offwhite transition-colors">
                                    <Heart className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-4 border border-gray-100 hover:bg-brand-offwhite transition-colors">
                                    <Share2 className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToBag}
                                className="w-full bg-black text-white py-6 uppercase text-[11px] tracking-[0.5em] font-bold flex items-center justify-center space-x-4 hover:bg-brand-accent transition-all duration-500 shadow-2xl"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Add to Bag</span>
                            </button>
                        </div>

                        {/* Gucci-style Accordion */}
                        <div className="border-t border-gray-100 divide-y divide-gray-100 pb-20">
                            <AccordionItem
                                title="Product Narrative"
                                isOpen={openSection === 'description'}
                                onClick={() => toggleSection('description')}
                                content={product.description}
                            />
                            <AccordionItem
                                title="Creation Details"
                                isOpen={openSection === 'details'}
                                onClick={() => toggleSection('details')}
                                content="Each stitch is a testament to raw beauty. Features signature gold-tone hardware, premium natural leather, and an adjustable strap for versatile wear."
                            />
                            <AccordionItem
                                title="Materials & Care"
                                isOpen={openSection === 'care'}
                                onClick={() => toggleSection('care')}
                                content="Sustainably sourced suede and leather. To preserve its raw beauty, store in the provided dust bag and avoid prolonged exposure to direct sunlight or moisture."
                            />
                            <AccordionItem
                                title="Shipping & Returns"
                                isOpen={openSection === 'shipping'}
                                onClick={() => toggleSection('shipping')}
                                content="Complimentary delivery across Bangladesh. Returns accepted within 7 days of receipt for unused creations in original packaging."
                            />
                        </div>
                    </div>
                </div>

                {/* You May Also Like Section */}
                <section className="py-32 border-t border-gray-100">
                    <h2 className="text-center text-xs uppercase tracking-[0.5em] font-bold mb-20 italic font-serif">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {relatedProducts.map((rel) => (
                            <Link key={rel.id} to={`/product/${rel.id}`} className="group flex flex-col items-center">
                                <div className="aspect-[3/4] overflow-hidden mb-6 bg-brand-offwhite w-full">
                                    <img src={rel.image_url} alt={rel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <h3 className="text-[10px] tracking-[0.2em] uppercase mb-2 font-bold text-center leading-tight">{rel.name}</h3>
                                <p className="text-[12px] font-serif italic text-gray-400">{formatPrice(rel.price)}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

const AccordionItem = ({ title, content, isOpen, onClick }: any) => (
    <div className="py-8">
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.3em] font-bold py-2 group"
        >
            <span className="group-hover:translate-x-1 transition-transform">{title}</span>
            {isOpen ? <Minus className="w-3 h-3 text-gray-400" /> : <Plus className="w-3 h-3 text-gray-400" />}
        </button>
        <div className={cn(
            "overflow-hidden transition-all duration-500",
            isOpen ? "max-h-96 pt-6 opacity-100" : "max-h-0 opacity-0"
        )}>
            <p className="text-xs md:text-sm leading-loose text-gray-500 font-light tracking-wide max-w-md italic font-serif">
                {content}
            </p>
        </div>
    </div>
);

// Helper
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default ProductDetail;
