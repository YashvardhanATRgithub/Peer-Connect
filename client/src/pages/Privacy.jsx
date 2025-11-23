import React from 'react';
import BackgroundVideo from '../components/BackgroundVideo';

const Privacy = () => {
    return (
        <div className="min-h-screen relative">
            <BackgroundVideo overlay="bg-orange-50/90" />
            <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
                    <p className="mb-4 text-sm text-slate-500">Last updated: November 2025</p>
                    <p className="mb-4">At PeerConnect, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
                    <h3 className="text-xl font-semibold mb-2">Information We Collect</h3>
                    <p className="mb-4">We collect information you provide directly to us, such as when you create an account, update your profile, or post content.</p>
                    <h3 className="text-xl font-semibold mb-2">How We Use Your Information</h3>
                    <p className="mb-4">We use your information to provide, maintain, and improve our services, and to communicate with you.</p>
                    <h3 className="text-xl font-semibold mb-2">Sharing of Information</h3>
                    <p className="mb-4">We do not share your personal information with third parties except as described in this policy or with your consent.</p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
