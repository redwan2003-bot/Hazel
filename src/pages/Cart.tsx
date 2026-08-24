import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/useCart';
import { formatPrice } from '../lib/utils';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="pt-40 pb-20 px-6 min-h-[70vh] flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-12 h-12 text-gray-200 mb-8" />
                <h1 className="text-2xl tracking-[0.3em] font-serif mb-6 uppercase">Your Bag is Empty</h1>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-12 max-w-xs">
                    Discover our latest collection of finely crafted bags.
                </p>
                <Link
                    to="/shop"
                    className="bg-black text-white px-10 py-4 uppercase text-[10px] tracking-[0.4em] hover:bg-gray-900 transition-colors"
                >
                    Explore Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-6 md:px-12 bg-white min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl tracking-[0.3em] font-serif uppercase mb-16 underline-offset-8 underline decoration-gray-100 italic">
                    Shopping Bag
                </h1>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Items List */}
                    <div className="flex-grow space-y-12">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-6 pb-12 border-b border-gray-50">
                                <div className="w-24 h-32 md:w-32 md:h-40 bg-brand-offwhite flex-shrink-0">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-grow flex flex-col justify-between py-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xs md:text-sm uppercase tracking-[0.2em] mb-2 font-medium">{item.name}</h3>
                                            <p className="text-[10px] tracking-[0.1em] text-gray-500 uppercase">{formatPrice(item.price)}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-black transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center border border-gray-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-50 bg-white"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-10 text-center text-xs font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-50 bg-white"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-xs font-serif italic">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:w-80 flex flex-col">
                        <div className="bg-brand-offwhite p-10">
                            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-8 text-gray-500">Order Summary</h4>

                            <div className="space-y-6 mb-10 pb-10 border-b border-gray-200">
                                <div className="flex justify-between text-[11px] tracking-[0.2em] uppercase">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] tracking-[0.2em] uppercase">
                                    <span>Shipping</span>
                                    <span className="text-gray-400 italic">Free Complimentary</span>
                                </div>
                            </div>

                            <div className="flex justify-between mb-12">
                                <span className="text-xs uppercase tracking-[0.3em] font-bold">Total</span>
                                <span className="text-sm font-serif italic text-black font-bold">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-black text-white py-4 px-6 uppercase text-[10px] tracking-[0.4em] flex items-center justify-center space-x-4 hover:bg-gray-900 transition-all group"
                            >
                                <span>Checkout</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <p className="mt-8 text-[10px] tracking-widest text-gray-400 leading-loose uppercase text-center md:text-left">
                            Complimentary shipping on all orders. <br />
                            Secure bKash payment verification process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
