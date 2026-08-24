import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../lib/useCart';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { Smartphone, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

const Checkout = () => {
    const { cart, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        district: '',
        instructions: '',
        bkashDigits: ''
    });

    if (cart.length === 0 && !orderPlaced) {
        navigate('/shop');
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                customer_name: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                district: formData.district,
                instructions: formData.instructions,
                items: cart,
                total: subtotal,
                bkash_digits: formData.bkashDigits,
                status: 'pending'
            };

            const { error } = await supabase.from('orders').insert([orderData]);
            if (error) throw error;

            setOrderPlaced(true);
            clearCart();
        } catch (error) {
            console.error('Error placing order:', error);
            alert('There was an error placing your order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="pt-40 pb-20 px-6 min-h-[70vh] flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-8" />
                <h1 className="text-3xl tracking-[0.3em] font-serif mb-6 uppercase italic">Order Received</h1>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-12 max-w-sm leading-relaxed">
                    Thank you for choosing THE HAZEL. We will verify your bKash payment and contact you shortly for delivery confirmation.
                </p>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-black text-white px-10 py-4 uppercase text-[10px] tracking-[0.4em] hover:bg-gray-900 transition-colors"
                >
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-6 md:px-12 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">

                {/* Checkout Form */}
                <div className="lg:w-3/5">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] font-medium text-gray-400 hover:text-black transition-colors mb-12"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Bag</span>
                    </button>

                    <h2 className="text-2xl tracking-[0.3em] font-serif uppercase mb-12 italic border-b border-gray-100 pb-10">
                        Delivery Details
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex flex-col space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest"
                                    placeholder="EX. RAHMAN ISLAM"
                                />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest"
                                    placeholder="017XXXXXXXX"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Delivery Address</label>
                            <textarea
                                required
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest resize-none"
                                placeholder="HOUSE NO, STREET, AREA"
                            />
                        </div>

                        <div className="flex flex-col space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">District / City</label>
                            <input
                                required
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest"
                                placeholder="EX. DHAKA"
                            />
                        </div>

                        <div className="flex flex-col space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Special Instructions (Optional)</label>
                            <input
                                type="text"
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleInputChange}
                                className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest"
                                placeholder="GIFT WRAP, DELIVERY PREFERENCE"
                            />
                        </div>

                        {/* Payment Verification Section */}
                        <div className="bg-brand-offwhite p-10 border border-gray-200 mt-20">
                            <div className="flex items-center space-x-4 mb-8">
                                < Smartphone className="w-5 h-5" />
                                <h3 className="text-xs uppercase tracking-[0.3em] font-bold italic">Step 2: Payment Verification</h3>
                            </div>

                            <div className="space-y-6 text-[11px] tracking-widest leading-loose text-gray-600 uppercase mb-10">
                                <p>Please pay <b>{formatPrice(subtotal)}</b> via bKash personal number:</p>
                                <div className="bg-white border text-center p-4 text-sm font-bold tracking-[0.4em] text-black">
                                    01740189096
                                </div>
                                <p className="text-[10px] text-gray-400 italic">Send the last 4 digits of your bKash Transaction ID below to verify your order.</p>
                            </div>

                            <div className="flex flex-col space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Last 4 Digits of Transition ID</label>
                                <input
                                    required
                                    type="text"
                                    name="bkashDigits"
                                    value={formData.bkashDigits}
                                    onChange={handleInputChange}
                                    maxLength={4}
                                    className="bg-white border-b border-gray-300 py-4 px-4 text-center text-xl font-bold tracking-[0.5em] focus:border-black transition-colors outline-none"
                                    placeholder="XXXX"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-6 px-6 uppercase text-[11px] tracking-[0.5em] font-bold flex items-center justify-center space-x-4 hover:bg-gray-900 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Place Your Order</span>
                                    <CheckCircle className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Preview (Desktop) */}
                <div className="lg:w-2/5 flex-shrink-0">
                    <div className="sticky top-32 p-10 bg-brand-offwhite border border-gray-100">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-10 pb-4 border-b border-gray-200 italic">In Your Bag</h4>

                        <div className="space-y-8 mb-10 max-h-[40vh] overflow-y-auto pr-4 scroll-thin">
                            {cart.map((item) => (
                                <div key={item.id} className="flex space-x-4">
                                    <div className="w-16 h-20 bg-white border border-gray-100 p-1 flex-shrink-0">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow pt-1">
                                        <p className="text-[10px] uppercase tracking-[0.15em] font-medium leading-tight mb-1">{item.name}</p>
                                        <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400">Qty: {item.quantity}</p>
                                        <p className="text-[11px] font-serif italic mt-2">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-8 space-y-4">
                            <div className="flex justify-between text-[11px] tracking-[0.2em] uppercase font-bold">
                                <span>Total Due</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
