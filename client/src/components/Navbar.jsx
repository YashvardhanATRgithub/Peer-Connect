import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Close dropdown on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-30 bg-transparent backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-2xl font-extrabold text-primary">
                        <span className="h-6 w-6 rounded-full bg-primary block" />
                        <span className="text-slate-900">PeerConnect</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <Link to="/dashboard" className="hidden sm:inline-flex text-sm font-semibold text-slate-800 hover:text-primary">
                        Explore
                    </Link>
                    {user ? (
                        <>
                            <Link to="/my-activities" className="hidden sm:inline-flex text-sm font-semibold text-slate-800 hover:text-primary">
                                My activities
                            </Link>
                            <div className="relative ml-2" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <img
                                        className="h-9 w-9 rounded-full object-cover border border-slate-200 hover:border-primary transition-colors"
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <span className="text-sm font-semibold text-slate-800 hidden md:block hover:text-primary transition-colors">
                                        {user.name}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User className="h-4 w-4" />
                                            View Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="secondary" size="sm" className="text-primary border-primary">Log in</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary" size="sm">Sign up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
