import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Users, Calendar, MapPin, ArrowRight, Search } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BackgroundVideo from '../components/BackgroundVideo';

const Landing = () => {
    const [activities, setActivities] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const load = async () => {
            if (!user?.college) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get('/activities', { params: { college: user.college } });
                setActivities(data);
            } catch (err) {
                console.error('Failed to load activities', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const filtered = useMemo(() => {
        if (!search.trim()) return activities;
        const q = search.toLowerCase();
        return activities.filter((a) =>
            [a.title, a.category, a.location].some((field) =>
                field?.toLowerCase().includes(q)
            )
        );
    }, [activities, search]);

    const handleJoin = async (id) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post(`/activities/${id}/join`);
            const { data } = await api.get('/activities');
            setActivities(data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join');
        }
    };

    const visible = filtered;

    const year = new Date().getFullYear();

    return (
        <div className="relative min-h-screen overflow-hidden">
            <BackgroundVideo overlay="bg-orange-50/70" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Hero */}
                <div className="grid lg:grid-cols-2 gap-10 items-center pt-12 lg:pt-16">
                    <div className="space-y-6">
                        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold">
                            Discover events near you
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                            The people platform for campus meetups
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Join groups you like, attend events, or start your own. PeerConnect makes it easy to get together on campus.
                        </p>

                        <div className="w-full rounded-2xl border border-slate-200 shadow-sm bg-white p-3 flex flex-col sm:flex-row gap-2">
                            <div className="flex flex-1 items-center gap-2 px-3 py-2 rounded-xl border border-slate-200">
                                <Search className="h-5 w-5 text-slate-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search for activities or groups"
                                    className="w-full bg-transparent outline-none text-sm text-slate-700"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Link to="/signup">
                                    <Button size="lg" className="whitespace-nowrap px-6 py-3">Get started</Button>
                                </Link>
                                <Link to="/dashboard">
                                    <Button variant="secondary" size="lg" className="border border-slate-200 text-slate-800 bg-white hover:bg-slate-50 px-6 py-3">
                                        Explore events
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {loading ? (
                            <p className="text-sm text-slate-500">Loading activities...</p>
                        ) : (
                            user && (
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(new Set(activities.map((a) => a.category))).map((cat) => (
                                        <span key={cat} className="px-3 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute -top-6 -left-6 h-full w-full rounded-3xl bg-primary/5" />
                        <div className="relative rounded-3xl border border-slate-200 bg-white shadow-lg p-4 space-y-4 max-h-[450px] overflow-y-auto pr-2">
                            {(!user || visible.length === 0) && !loading && (
                                <p className="text-sm text-slate-500 px-2 py-4">
                                    {user ? 'No activities yet. Create the first one!' : 'Join PeerConnect to see activities.'}
                                </p>
                            )}
                            {user && visible.map((item, idx) => (
                                <div key={item._id} className="flex gap-3 p-3 rounded-2xl border border-slate-200 hover:border-primary/40 hover:shadow-md transition">
                                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {item.category} · {new Date(item.date).toLocaleDateString()} · {item.location}
                                        </p>
                                        <p className="text-xs text-slate-600 mt-2">{item.participants?.length || 0} attending</p>
                                    </div>
                                    <Button size="sm" variant="secondary" onClick={() => handleJoin(item._id)}>
                                        Join
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* How it works */}
                <div className="py-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">How PeerConnect works</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { icon: Users, title: 'Join groups', desc: 'Pick clubs and crews that match your interests.' },
                            { icon: Calendar, title: 'Attend events', desc: 'RSVP to what you like and see who else is going.' },
                            { icon: MapPin, title: 'Host your own', desc: 'Create meetups, manage capacity, and let people join.' },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mb-12 rounded-3xl bg-primary/80 backdrop-blur text-white px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg border border-white/30">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide">Start a group</p>
                        <h3 className="text-2xl font-bold mt-1">Bring people together around what you love</h3>
                        <p className="text-white/80 text-sm mt-1">Post your first meetup and watch the RSVPs roll in.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="bg-white text-primary font-bold px-6 py-3 rounded-full shadow-md hover:bg-white hover:text-primary hover:shadow-lg border border-white/60"
                            onClick={() => navigate(user ? '/create-activity' : '/signup')}
                        >
                            Create event
                        </Button>
                        <Link to="/dashboard">
                            <Button
                                variant="ghost"
                                size="lg"
                                className="bg-transparent text-white border border-white/80 rounded-full px-6 py-3 hover:bg-white/20"
                            >
                                Browse events
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-20 border-t border-slate-200 pt-16 pb-8 relative z-10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8 mb-12">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-8 rounded-full bg-primary" />
                                    <span className="text-xl font-extrabold text-slate-900">PeerConnect</span>
                                </div>
                                <p className="text-slate-700 font-medium text-sm leading-relaxed max-w-xs">
                                    The easiest way to find your people on campus. Join groups, host events, and make memories that last a lifetime.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                                    <li><Link to="/dashboard" className="hover:text-primary transition-colors">Explore Events</Link></li>
                                    <li><Link to="/signup" className="hover:text-primary transition-colors">Create Account</Link></li>
                                    <li><Link to="/login" className="hover:text-primary transition-colors">Log In</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">Community</h4>
                                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                                    <li><Link to="/guidelines" className="hover:text-primary transition-colors">Guidelines</Link></li>
                                    <li><Link to="/safety" className="hover:text-primary transition-colors">Safety</Link></li>
                                    <li><Link to="/support" className="hover:text-primary transition-colors">Support</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-slate-600 font-medium">
                                © {year} PeerConnect. Made with <span className="text-red-500">♥</span> by Group 13.
                            </p>
                            <div className="flex gap-6 text-sm text-slate-600 font-medium">
                                <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
                                <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Landing;
