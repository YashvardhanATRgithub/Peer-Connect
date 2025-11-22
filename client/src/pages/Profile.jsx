import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [form, setForm] = useState({
        name: '',
        email: '',
        avatar: '',
        password: '',
        interests: '',
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setForm({
                    name: data.name || '',
                    email: data.email || '',
                    avatar: data.avatar || '',
                    password: '',
                    interests: (data.interests || []).join(', '),
                });
            } catch (err) {
                setStatus('Failed to load profile');
            }
        };
        if (user) {
            load();
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        try {
            await updateProfile({
                name: form.name,
                email: form.email,
                avatar: form.avatar,
                password: form.password || undefined,
                interests: form.interests
                    .split(',')
                    .map((i) => i.trim())
                    .filter(Boolean),
            });
            setStatus('Profile updated!');
            setForm((prev) => ({ ...prev, password: '' }));
        } catch (err) {
            setStatus(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 text-center">
                    <p className="text-slate-700">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Your profile</h1>
                <p className="text-sm text-slate-600 mb-6">Update your details and how others see you.</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-4">
                        <img
                            src={form.avatar || user?.avatar}
                            alt={form.name}
                            className="h-16 w-16 rounded-full object-cover border border-slate-200"
                        />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-800 mb-1">Avatar URL</label>
                            <input
                                name="avatar"
                                value={form.avatar}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-800 mb-1">Full name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-800 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-slate-800">New password</label>
                            <span className="text-xs text-slate-500">Leave blank to keep current</span>
                        </div>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-800 mb-1">Interests</label>
                        <input
                            name="interests"
                            value={form.interests}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                            placeholder="e.g., Sports, Tech, Music"
                        />
                        <p className="text-xs text-slate-500 mt-1">Comma-separated. Used to recommend activities.</p>
                    </div>

                    {status && (
                        <div className="text-sm text-primary">{status}</div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={loading}>
                            Save changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
