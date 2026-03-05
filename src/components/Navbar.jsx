import React, { useState, useEffect, useRef } from 'react';
import { Home, Search, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getIsAuthenticated, getIsAdmin, logoutUser } from '../services/auth';
import { useUser } from '../context/UserContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = getIsAuthenticated();
    const isAdmin = getIsAdmin();
    const { userDetails, clearUserDetails } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isActive = (path) => {
        return location.pathname === path ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600';
    };

    const handleLogout = async () => {
        await logoutUser();
        clearUserDetails();
        setIsMenuOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

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
                        {/* <Link to="/profile" className={`font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/profile')}`}>
                            <User size={18} />
                            <span>Profile</span>
                        </Link> */}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated && (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <User size={18} />
                                <span className="hidden sm:inline">Sign in</span>
                            </Link>
                        )}

                        {isAuthenticated && (
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen((open) => !open)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <User size={18} />
                                    <span className="hidden sm:inline">
                                        {userDetails?.fullName || 'Account'}
                                    </span>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-lg border border-slate-100 py-2 text-sm">
                                        <div className="px-4 pb-2 border-b border-slate-100">
                                            <p className="font-semibold text-slate-900 truncate">
                                                {userDetails?.fullName || 'Signed in'}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {userDetails?.email}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate('/profile');
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                                        >
                                            Profile
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate('/trips');
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                                        >
                                            My Trips
                                        </button>

                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate('/admin/dashboard');
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                                            >
                                                Admin dashboard
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
