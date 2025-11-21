import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';

const ActivityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchActivity = async () => {
        try {
            const { data } = await api.get(`/activities/${id}`);
            setActivity(data);
        } catch (error) {
            console.error('Failed to fetch activity', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, [id]);

    const handleJoin = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post(`/activities/${id}/join`);
            fetchActivity();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to join');
        }
    };

    const handleLeave = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post(`/activities/${id}/leave`);
            fetchActivity();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to leave');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!activity) return <div className="p-8 text-center">Activity not found</div>;

    const getId = (p) => (typeof p === 'string' ? p : p?._id?.toString());
    const uid = user?._id?.toString();
    const isJoined = activity.participants.some(p => getId(p) === uid);
    const isWaitlisted = activity.waitlist.some(p => getId(p) === uid);
    const isCreator = getId(activity.creator) === uid;
    const isFull = activity.participants.length >= activity.capacity;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="bg-white shadow-sm border border-slate-200 overflow-hidden sm:rounded-3xl">
                <div className="px-4 py-6 sm:px-8 bg-gradient-to-r from-primary to-primaryDark text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                                {activity.category}
                            </span>
                            <h3 className="mt-3 text-3xl font-semibold leading-7">{activity.title}</h3>
                            <p className="mt-1 text-sm text-white/80">Hosted by {activity.creator.name}</p>
                        </div>
                        {user && (
                            <div>
                                {isCreator ? (
                                    <Button disabled>Owner</Button>
                                ) : isJoined ? (
                                    <Button variant="secondary" onClick={handleLeave}>Leave Activity</Button>
                                ) : isWaitlisted ? (
                                    <Button variant="secondary" onClick={handleLeave}>Leave Waitlist</Button>
                                ) : (
                                    <Button
                                        variant={isFull ? 'secondary' : 'primary'}
                                        onClick={handleJoin}
                                    >
                                        {isFull ? 'Join Waitlist' : 'Join Activity'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-4 py-6 sm:px-8">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-slate-600 flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-indigo-500" /> Date
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                {new Date(activity.date).toLocaleDateString()}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-slate-600 flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-indigo-500" /> Time
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-slate-900">{activity.time}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-slate-600 flex items-center">
                                <MapPin className="mr-2 h-4 w-4 text-indigo-500" /> Location
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-slate-900">{activity.location}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-slate-600 flex items-center">
                                <Users className="mr-2 h-4 w-4 text-indigo-500" /> Capacity
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                {activity.participants.length} / {activity.capacity} joined
                                {activity.waitlist.length > 0 && ` (${activity.waitlist.length} on waitlist)`}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-slate-600">Description</dt>
                            <dd className="mt-2 text-sm text-slate-800 whitespace-pre-wrap bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                                {activity.description || 'No description provided.'}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-slate-600">Participants</dt>
                            <dd className="mt-3">
                                <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white/70">
                                    {activity.participants.map((participant) => (
                                        <li key={participant._id} className="flex items-center justify-between py-3 px-4 text-sm">
                                            <div className="flex items-center">
                                                <img className="h-8 w-8 rounded-full mr-3" src={participant.avatar} alt={participant.name} />
                                                <span className="font-semibold text-slate-900">{participant.name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetails;
