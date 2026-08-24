import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-brand-black text-brand-white pt-20 pb-10 px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-3xl tracking-[0.4em] mb-4">THE HAZEL</h2>
                    <p className="text-gray-400 text-sm max-w-sm tracking-widest uppercase">
                        Finely crafted bags that echo raw beauty and everyday elegance.
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-semibold mb-6 tracking-[0.2em] text-gray-500">Shop</h4>
                    <ul className="space-y-4 text-sm tracking-widest uppercase font-light">
                        <li><Link to="/shop" className="hover:text-gray-400 transition-colors">All Bags</Link></li>
                        <li><Link to="/shop?category=classic" className="hover:text-gray-400 transition-colors">Classic Collection</Link></li>
                        <li><Link to="/shop?category=limited" className="hover:text-gray-400 transition-colors">Limited Edition</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-semibold mb-6 tracking-[0.2em] text-gray-500">Service</h4>
                    <ul className="space-y-4 text-sm tracking-widest uppercase font-light">
                        <li><Link to="/contact" className="hover:text-gray-400 transition-colors">Contact Us</Link></li>
                        <li><Link to="/shipping" className="hover:text-gray-400 transition-colors">Shipping & Returns</Link></li>
                        <li><Link to="/care" className="hover:text-gray-400 transition-colors">Care Guide</Link></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-10 flex flex-col md:row items-center justify-between text-[10px] tracking-[0.3em] font-light uppercase text-gray-500">
                <p>&copy; 2024 THE HAZEL. ALL RIGHTS RESERVED.</p>
                <div className="flex space-x-8 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">Facebook</a>
                    <a href="#" className="hover:text-white transition-colors">Pinterest</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
