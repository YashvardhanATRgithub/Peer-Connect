import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const colleges = [
    { name: 'NIT Calicut', domain: 'nitc.ac.in' },
    { name: 'NIT Trichy', domain: 'nitt.edu' },
    { name: 'IIT Bombay', domain: 'iitb.ac.in' },
    { name: 'IIT Delhi', domain: 'iitd.ac.in' },
    { name: 'Chandigarh University', domain: 'cuchd.in' },
];

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [college, setCollege] = useState(colleges[0].name);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const selected = colleges.find((c) => c.name === college);
        if (selected && !email.endsWith(`@${selected.domain}`)) {
            setError(`Email must end with @${selected.domain}`);
            setLoading(false);
            return;
        }
        try {
            const resp = await register(name, email, password, college);
            setInfo(resp?.message || 'Check your email to verify your account.');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-14 bg-muted">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-semibold text-primary border border-slate-200 shadow-sm">
                        New here?
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Create your PeerConnect account</h2>
                    <p className="text-sm text-slate-600 mt-2">Host or join activities in under a minute.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-800">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                placeholder="Alex Martinez"
                            />
                        </div>

                        <div>
                            <label htmlFor="college" className="block text-sm font-medium text-slate-800">
                                College
                            </label>
                            <div className="mt-2">
                                <select
                                    id="college"
                                    name="college"
                                    value={college}
                                    onChange={(e) => setCollege(e.target.value)}
                                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                >
                                    {colleges.map((c) => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Email must end with the selected college domain.</p>
                        </div>

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
                            <label htmlFor="password" className="block text-sm font-medium text-slate-800">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                                placeholder="Create a strong password"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</div>
                        )}
                        {info && !error && (
                            <div className="text-green-600 text-sm text-center bg-green-50 border border-green-100 px-3 py-2 rounded-xl">{info}</div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={loading}
                            >
                                Create account
                            </Button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-primaryDark">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
