import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Users, Calendar, MapPin, ArrowRight, Search } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const [activities, setActivities] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get('/activities');
                setActivities(data);
            } catch (err) {
                console.error('Failed to load activities', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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

    const visible = filtered.slice(0, 4);

    return (
        <div className="bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(activities.map((a) => a.category))).map((cat) => (
                                    <span key={cat} className="px-3 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute -top-6 -left-6 h-full w-full rounded-3xl bg-primary/5" />
                        <div className="relative rounded-3xl border border-slate-200 bg-white shadow-lg p-4 space-y-4">
                            {visible.length === 0 && !loading && (
                                <p className="text-sm text-slate-500 px-2 py-4">No activities yet. Create the first one!</p>
                            )}
                            {visible.map((item, idx) => (
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
                <div className="mb-16 rounded-3xl bg-primary text-white px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide">Start a group</p>
                        <h3 className="text-2xl font-bold mt-1">Bring people together around what you love</h3>
                        <p className="text-white/80 text-sm mt-1">Post your first meetup and watch the RSVPs roll in.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="bg-white text-primary font-bold px-6 py-3 rounded-full"
                            onClick={() => navigate(user ? '/create-activity' : '/signup')}
                        >
                            Create event
                        </Button>
                        <Link to="/dashboard">
                            <Button variant="ghost" size="lg" className="bg-primaryDark text-white border border-white/30 rounded-full px-6 py-3">
                                Browse events
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
