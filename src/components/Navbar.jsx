import React from 'react';
import { Home, Search, User, PlusCircle, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600';
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/20 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300 transform group-hover:-translate-y-0.5">
                            <Home size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-gradient">LuxeRentals</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/')}`}>
                            <Search size={18} />
                            <span>Explore</span>
                        </Link>
                        <Link to="/manage" className={`font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/manage')}`}>
                            <PlusCircle size={18} />
                            <span>Manage Properties</span>
                        </Link>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <User size={18} />
                            <span className="hidden sm:inline">Sign In</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
