import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
            setError('Invalid administrative credentials.');
            setPassword('');
        } else {
            navigate('/admin/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="pt-40 pb-20 px-6 min-h-screen flex items-center justify-center bg-brand-offwhite">
            <div className="w-full max-w-md bg-white p-12 shadow-sm border border-gray-100">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-6">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl tracking-[0.3em] font-serif uppercase italic">Admin Portal</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-2">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="flex flex-col space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-widest text-center"
                            placeholder="admin@thehazel.com"
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400">Access Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-b border-gray-200 py-3 text-sm focus:border-black transition-colors outline-none tracking-[0.5em] text-center"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 text-red-500 text-[10px] uppercase tracking-widest justify-center">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 px-6 uppercase text-[10px] tracking-[0.4em] flex items-center justify-center space-x-4 hover:bg-gray-900 transition-all group disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <span>Authenticate</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
