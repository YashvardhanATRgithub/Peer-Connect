import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';
import BackgroundVideo from '../components/BackgroundVideo';

const Dashboard = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const openChatId = location.state?.openChat;

    const fetchActivities = async () => {
        try {
            const params = {};
            if (user?.college) params.college = user.college;
            const { data } = await api.get('/activities', { params });
            setActivities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch activities', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    // Clear the openChat state after it's been consumed to prevent persistence on refresh
    // and to allow re-triggering if the user clicks the notification again
    useEffect(() => {
        if (location.state?.openChat) {
            // Use a small timeout to ensure child components have mounted and processed the prop
            const timer = setTimeout(() => {
                navigate(location.pathname, { replace: true, state: {} });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location.state, navigate, location.pathname]);

    useEffect(() => {
        if (!authLoading) {
            fetchActivities();
        }
    }, [user, authLoading]);

    const handleJoin = async (id) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post(`/activities/${id}/join`);
            fetchActivities(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to join');
        }
    };

    const handleLeave = async (id) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post(`/activities/${id}/leave`);
            fetchActivities(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to leave');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this activity?')) return;
        try {
            await api.delete(`/activities/${id}`);
            fetchActivities();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete');
        }
    };

    const handleEdit = (id) => {
        navigate(`/activities/${id}/edit`);
    };

    const applyFilter = (list) =>
        filter === 'All' ? list : list.filter((a) => a.category === filter);

    const filteredActivities = applyFilter(activities);

    const categories = ['All', 'Sports', 'Study', 'Event', 'Other'];
    const userInterests = (user?.interests || []).map((i) => i.toLowerCase());

    const recommendedActivities = useMemo(() => {
        if (!userInterests.length) return [];
        const matchesInterests = activities.filter((a) => {
            const haystack = `${a.title} ${a.category} ${a.description || ''}`.toLowerCase();
            return userInterests.some((interest) => haystack.includes(interest));
        });
        return applyFilter(matchesInterests);
    }, [activities, userInterests, filter]);

    if (authLoading || loading) {
        return <div className="flex justify-center items-center h-screen text-slate-500">Loading...</div>;
    }

    const uniqueCategories = new Set(
        activities.map((a) => (a.category ? a.category.toString() : ''))
    );
    const stats = [
        { label: 'Activities live', value: activities.length || 0 },
        { label: 'Categories', value: Array.from(uniqueCategories).filter(Boolean).length },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <BackgroundVideo overlay="bg-orange-50/70" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="rounded-3xl bg-white border border-slate-200 shadow-sm mb-6 px-6 py-6 sm:px-8">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mt-1">Explore activities</h1>
                            <p className="text-slate-600 text-sm">Pick a category, join instantly, or launch your own.</p>
                        </div>
                        <Link to={user ? "/create-activity" : "/signup"}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                <Plus className="h-4 w-4 mr-2" />
                                Create event
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {stats.map((item) => (
                            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner">
                                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                                <p className="text-lg font-semibold text-slate-900 mt-1">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                    <div className="flex items-center flex-wrap gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all ${filter === cat
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {user && recommendedActivities.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-3">
                            <div>
                                <p className="text-sm font-semibold text-primary uppercase tracking-wide">Recommended</p>
                                <h2 className="text-xl font-bold text-slate-900">Based on your interests</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedActivities.map((activity) => (
                                <ActivityCard
                                    key={`rec-${activity._id}`}
                                    activity={activity}
                                    onJoin={handleJoin}
                                    onLeave={handleLeave}
                                    currentUserId={user?._id}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    autoOpenChat={activity._id === openChatId}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {user && recommendedActivities.length > 0 && (
                    <div className="my-6">
                        <div className="flex items-center gap-3 text-slate-500 text-sm">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span>All activities</span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>
                    </div>
                )}

                {filteredActivities.length === 0 ? (
                    <div className="text-center py-14 bg-white/80 backdrop-blur rounded-3xl border border-dashed border-slate-200 shadow-md">
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">No activities found</h3>
                        <p className="mt-1 text-sm text-slate-600">Try another category or create the first one.</p>
                        <div className="mt-6 flex justify-center">
                            <Link to="/create-activity">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Activity
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredActivities.map((activity) => (
                            <ActivityCard
                                key={activity._id}
                                activity={activity}
                                onJoin={handleJoin}
                                onLeave={handleLeave}
                                currentUserId={user?._id}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                autoOpenChat={activity._id === openChatId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
