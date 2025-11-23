import React from 'react';
import BackgroundVideo from '../components/BackgroundVideo';

const Terms = () => {
    return (
        <div className="min-h-screen relative">
            <BackgroundVideo overlay="bg-orange-50/90" />
            <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
                    <p className="mb-4 text-sm text-slate-500">Last updated: November 2025</p>
                    <p className="mb-4">Please read these Terms of Service carefully before using PeerConnect.</p>
                    <h3 className="text-xl font-semibold mb-2">Acceptance of Terms</h3>
                    <p className="mb-4">By accessing or using our service, you agree to be bound by these terms.</p>
                    <h3 className="text-xl font-semibold mb-2">User Accounts</h3>
                    <p className="mb-4">You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
                    <h3 className="text-xl font-semibold mb-2">Content</h3>
                    <p className="mb-4">Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post.</p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
