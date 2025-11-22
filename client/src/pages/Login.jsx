import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import BackgroundVideo from '../components/BackgroundVideo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-14">
            <BackgroundVideo overlay="bg-orange-50/70" />
            <div className="relative w-full max-w-md">
                <div className="mb-6 text-center">
                    <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-semibold text-primary border border-slate-200 shadow-sm">
                        Welcome back
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
                    <p className="text-sm text-slate-600 mt-2">Keep your activities, RSVPs, and waitlists synced.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-800">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                placeholder="you@school.edu"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-800">
                                    Password
                                </label>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={loading}
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Not a member?{' '}
                        <Link to="/signup" className="font-semibold text-primary hover:text-primaryDark">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
