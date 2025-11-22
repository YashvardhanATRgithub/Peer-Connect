import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import BackgroundVideo from '../components/BackgroundVideo';

const EditActivity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Sports',
        date: '',
        time: '',
        location: '',
        description: '',
        capacity: 5,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get(`/activities/${id}`);
                setFormData({
                    title: data.title,
                    category: data.category,
                    date: data.date?.substring(0, 10),
                    time: data.time,
                    location: data.location,
                    description: data.description,
                    capacity: data.capacity,
                });
            } catch (err) {
                setError('Failed to load activity');
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.put(`/activities/${id}`, formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update activity');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen relative overflow-hidden">
            <BackgroundVideo overlay="bg-white/70" />
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="mb-6">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wide">Edit activity</p>
                    <h1 className="text-3xl font-bold text-slate-900 mt-2">Update your meetup details</h1>
                </div>

                <div className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm rounded-3xl">
                    <div className="px-4 py-6 sm:p-8">
                        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="title" className="block text-sm font-semibold text-slate-800">
                                    Activity title
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                        placeholder="e.g., Weekend Basketball Game"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="category" className="block text-sm font-semibold text-slate-800">
                                    Category
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                    >
                                        <option>Sports</option>
                                        <option>Study</option>
                                        <option>Event</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="date" className="block text-sm font-semibold text-slate-800">
                                    Date
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        required
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="time" className="block text-sm font-semibold text-slate-800">
                                    Time
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="time"
                                        name="time"
                                        id="time"
                                        required
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="location" className="block text-sm font-semibold text-slate-800">
                                    Location
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                        placeholder="e.g., Campus Gym, Library Room 304"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="capacity" className="block text-sm font-semibold text-slate-800">
                                    Max capacity
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="capacity"
                                        id="capacity"
                                        min="2"
                                        required
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="description" className="block text-sm font-semibold text-slate-800">
                                    Description
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                        placeholder="Describe the activity..."
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="flex items-center justify-end gap-x-3 border-t border-slate-100 px-4 py-4 sm:px-8">
                        <Button variant="ghost" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} isLoading={loading}>
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditActivity;
