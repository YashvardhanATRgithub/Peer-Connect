import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { LogOut, User, Bell, X } from 'lucide-react';
import io from 'socket.io-client';
import api from '../api/axios';

// Initialize socket
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        if (user) {
            socket.emit('join_user_room', user._id);
            fetchNotifications();

            socket.on('new_notification', () => {
                fetchNotifications();
            });

            return () => {
                socket.off('new_notification');
            };
        }
    }, [user]);

    // Close dropdowns on route change
    useEffect(() => {
        setIsOpen(false);
        setShowNotifications(false);
    }, [location.pathname]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            try {
                await api.put(`/notifications/${notification._id}/read`);
                setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, read: true } : n));
            } catch (error) {
                console.error('Failed to mark read', error);
            }
        }
        setShowNotifications(false);
        navigate('/dashboard', { state: { openChat: notification.activity._id } });
    };

    const handleClearAll = async () => {
        try {
            await api.delete('/notifications');
            setNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications', error);
        }
    };

    const handleDeleteNotification = async (e, id) => {
        e.stopPropagation(); // Prevent triggering click on parent
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

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

                            {/* Notification Bell */}
                            <div className="relative ml-2" ref={notificationRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 text-slate-600 hover:text-primary transition-colors focus:outline-none"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-2 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                            {notifications.length > 0 && (
                                                <button
                                                    onClick={handleClearAll}
                                                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div
                                                        key={notification._id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className={`relative px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 ${!notification.read ? 'bg-blue-50/30' : ''} group`}
                                                    >
                                                        <div className="pr-6">
                                                            <p className="text-sm text-slate-800">
                                                                <span className="font-semibold">{notification.sender.name}</span> mentioned you in <span className="font-medium text-primary">{notification.activity.title}</span>
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => handleDeleteNotification(e, notification._id)}
                                                            className="absolute top-3 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                                            title="Delete notification"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-sm text-slate-500">
                                                    No notifications yet
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative ml-1" ref={dropdownRef}>
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
