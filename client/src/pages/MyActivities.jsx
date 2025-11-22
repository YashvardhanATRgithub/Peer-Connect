import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ActivityCard from '../components/ActivityCard';
import { useNavigate } from 'react-router-dom';

const MyActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const { data } = await api.get('/activities');
            // Filter client-side for now since we didn't make a specific endpoint
            const myActivities = data.filter(a => {
                const getId = (p) => (typeof p === 'string' ? p : p?._id?.toString());
                const uid = user._id.toString();
                return (
                    getId(a.creator) === uid ||
                    a.participants.some(p => getId(p) === uid) ||
                    a.waitlist.some(p => getId(p) === uid)
                );
            });
            setActivities(myActivities);
        } catch (error) {
            console.error('Failed to fetch activities', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchActivities();
    }, [user, navigate]);

    const handleJoin = async (id) => {
        try {
            await api.post(`/activities/${id}/join`);
            fetchActivities();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to join');
        }
    };

    const handleLeave = async (id) => {
        try {
            await api.post(`/activities/${id}/leave`);
            fetchActivities();
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

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Your schedule</p>
                    <h1 className="text-3xl font-bold text-slate-900">My activities</h1>
                    <p className="text-slate-600 text-sm">Everything you are hosting or attending in one view.</p>
                </div>
            </div>

            {activities.length === 0 ? (
                <div className="text-center py-14 bg-white/80 backdrop-blur rounded-3xl border border-dashed border-slate-200 shadow-md">
                    <p className="text-slate-600">You haven&apos;t created or joined any activities yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity) => (
                        <ActivityCard
                            key={activity._id}
                            activity={activity}
                            onJoin={handleJoin}
                            onLeave={handleLeave}
                            currentUserId={user?._id}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyActivities;
