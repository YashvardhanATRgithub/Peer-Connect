import React from 'react';
import BackgroundVideo from '../components/BackgroundVideo';

const Safety = () => {
    return (
        <div className="min-h-screen relative">
            <BackgroundVideo overlay="bg-orange-50/90" />
            <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Safety Tips</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
                    <p className="mb-4">Your safety is our top priority. Here are some tips to help you stay safe while using PeerConnect:</p>
                    <h3 className="text-xl font-semibold mb-2">Meeting in Person</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Public Places:</strong> Always meet in well-lit, public locations for the first time.</li>
                        <li><strong>Tell a Friend:</strong> Let someone know where you are going and who you are meeting.</li>
                        <li><strong>Trust Your Instincts:</strong> If something feels off, it probably is. Don't be afraid to leave or cancel.</li>
                    </ul>
                    <h3 className="text-xl font-semibold mb-2">Online Safety</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Personal Info:</strong> Avoid sharing sensitive personal information (like financial details) with strangers.</li>
                        <li><strong>Report Suspicious Activity:</strong> If you encounter suspicious behavior, report it to our support team immediately.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Safety;
