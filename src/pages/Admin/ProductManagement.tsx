import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Loader2 } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
                image_url: product.image_url
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                image_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                image_url: formData.image_url
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product details.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this creation from the vault?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="bg-white p-10 mt-12 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="text-xl tracking-[0.3em] font-serif uppercase italic">Vault Management</h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-2">Curate the Hazel Collection</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white px-8 py-4 uppercase text-[10px] tracking-[0.3em] flex items-center space-x-3 hover:bg-gray-900 transition-all font-bold"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Entry</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((product) => (
                    <div key={product.id} className="group bg-brand-offwhite border border-gray-100 flex flex-col p-6 transition-all hover:shadow-md">
                        <div className="aspect-[4/5] overflow-hidden mb-6 bg-white border border-gray-100 relative">
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(product)}
                                    className="p-3 bg-white text-black shadow-sm hover:bg-black hover:text-white transition-all rounded-full"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-3 bg-white text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all rounded-full"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-2">{product.name}</h3>
                        <p className="text-sm font-serif italic text-gray-600 mb-4">{formatPrice(product.price)}</p>
                        <div className="mt-auto pt-4 border-t border-gray-200">
                            <span className="text-[9px] uppercase tracking-[0.2em] py-1 px-3 bg-white border border-gray-100 text-gray-400 font-bold">
                                {product.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && !loading && (
                <div className="py-20 text-center border-2 border-dashed border-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 italic">Vault is currently empty.</p>
                </div>
            )}

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl p-12 overflow-y-auto max-h-[90vh] shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl tracking-[0.3em] font-serif uppercase italic mb-12">
                            {editingProduct ? 'Update Entry' : 'New Vault Entry'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="flex flex-col space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Creation Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest"
                                    placeholder="EX. CLASSIC LEATHER TOTE"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="flex flex-col space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Investment (BDT)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest font-serif"
                                        placeholder="5500"
                                    />
                                </div>
                                <div className="flex flex-col space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Category Tag</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest"
                                        placeholder="EX. TOTE"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Editorial Narrative</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="border border-gray-100 p-4 text-xs focus:border-black transition-colors outline-none tracking-widest leading-loose resize-none"
                                    placeholder="Describe the raw beauty of this piece..."
                                />
                            </div>

                            <div className="flex flex-col space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Visual URL</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest"
                                    placeholder="https://example.com/bag.jpg"
                                />
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-loose italic">
                                    Note: In production, this would be an image upload to Supabase Storage.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-black text-white py-6 px-6 uppercase text-[11px] tracking-[0.5em] font-bold flex items-center justify-center space-x-4 hover:bg-gray-900 transition-all disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Secure Entry</span>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
