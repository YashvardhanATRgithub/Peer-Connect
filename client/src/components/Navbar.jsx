import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { LogOut, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-100">
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
                    <Link to="/my-activities" className="hidden sm:inline-flex text-sm font-semibold text-slate-800 hover:text-primary">
                        My activities
                    </Link>
                    {user ? (
                        <>
                            <Link to="/profile">
                                <div className="flex items-center gap-2 ml-2">
                                    <img
                                        className="h-8 w-8 rounded-full object-cover border border-slate-200"
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <span className="text-sm font-semibold text-slate-800 hidden md:block">{user.name}</span>
                                </div>
                            </Link>
                            <Button variant="secondary" size="sm" onClick={handleLogout} className="text-primary border-primary">
                                <LogOut className="h-5 w-5" />
                                <span className="ml-1 hidden sm:inline">Logout</span>
                            </Button>
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
