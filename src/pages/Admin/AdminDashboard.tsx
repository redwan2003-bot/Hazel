import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';
import ProductManagement from './ProductManagement';
import {
    ShoppingBag,
    TrendingUp,
    Clock,
    CheckCircle,
    Eye,
    LayoutDashboard,
    Box,
    LogOut,
    RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pending: 0,
        delivered: 0
    });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/admin');
                return;
            }
            setCheckingAuth(false);
            fetchOrders();
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) navigate('/admin');
        });

        return () => subscription.subscription.unsubscribe();
    }, [navigate]);

    if (checkingAuth) {
        return (
            <div className="pt-40 flex justify-center h-screen bg-white">
                <div className="w-6 h-6 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const ordersData = data || [];
            setOrders(ordersData);

            const newStats = ordersData.reduce((acc: any, order: any) => {
                acc.totalOrders++;
                if (order.status === 'delivered') acc.totalRevenue += Number(order.total);
                if (order.status === 'pending') acc.pending++;
                if (order.status === 'delivered') acc.delivered++;
                return acc;
            }, { totalRevenue: 0, totalOrders: 0, pending: 0, delivered: 0 });

            setStats(newStats);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Admin Sidebar/Header */}
            <div className="bg-brand-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center space-x-12">
                    <h1 className="text-lg tracking-[0.3em] font-serif uppercase italic">H. Admin</h1>
                    <nav className="flex items-center space-x-8">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`text-[10px] uppercase tracking-[0.2em] flex items-center space-x-2 transition-colors ${activeTab === 'orders' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Orders</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`text-[10px] uppercase tracking-[0.2em] flex items-center space-x-2 transition-colors ${activeTab === 'products' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Box className="w-4 h-4" />
                            <span>Products</span>
                        </button>
                    </nav>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-rose-400 flex items-center space-x-2 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Exit Vault</span>
                </button>
            </div>

            <div className="p-6 md:p-12 max-w-7xl mx-auto">
                {activeTab === 'orders' ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <StatCard icon={<TrendingUp />} label="Revenue" value={formatPrice(stats.totalRevenue)} sub="Delivered Only" />
                            <StatCard icon={<ShoppingBag />} label="Orders" value={stats.totalOrders} sub="Total Submissions" />
                            <StatCard icon={<Clock />} label="Pending" value={stats.pending} sub="Awaiting Check" color="text-amber-500" />
                            <StatCard icon={<CheckCircle />} label="Delivered" value={stats.delivered} sub="Successful Cycles" color="text-emerald-500" />
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white border border-gray-100 shadow-sm">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xs uppercase tracking-[0.3em] font-bold italic font-serif">Inbound Queue</h2>
                                <button onClick={fetchOrders} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} /></button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Ref</th>
                                            <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Client</th>
                                            <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Total</th>
                                            <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 text-center">bKash 4</th>
                                            <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Status</th>
                                            <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6 text-[10px] font-mono text-gray-400">#{order.id.slice(0, 6)}</td>
                                                <td className="px-8 py-6">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider">{order.customer_name}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">{order.phone}</p>
                                                </td>
                                                <td className="px-8 py-6 text-xs font-serif italic">{formatPrice(order.total)}</td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="bg-gray-100 px-3 py-1 font-bold tracking-widest border border-gray-200 text-xs">
                                                        {order.bkash_digits}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        className="bg-white border border-gray-200 text-[9px] uppercase tracking-[0.2em] font-bold rounded-full px-4 py-2 outline-none"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <button className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-100">
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <ProductManagement />
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, sub, color = "text-gray-400" }: any) => (
    <div className="bg-brand-offwhite p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">{React.cloneElement(icon, { className: "w-4 h-4" })}</div>
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">{label}</span>
        </div>
        <p className="text-2xl font-serif italic mb-1">{value}</p>
        <p className={`text-[9px] uppercase tracking-widest font-medium ${color}`}>{sub}</p>
    </div>
);

export default AdminDashboard;
