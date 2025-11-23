import React from 'react';
import BackgroundVideo from '../components/BackgroundVideo';

const Guidelines = () => {
    return (
        <div className="min-h-screen relative">
            <BackgroundVideo overlay="bg-orange-50/90" />
            <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Community Guidelines</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
                    <p className="mb-4">Welcome to PeerConnect! To ensure a safe and welcoming environment for everyone, please adhere to the following guidelines:</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Be Respectful:</strong> Treat all members with respect and kindness. Harassment or hate speech will not be tolerated.</li>
                        <li><strong>Stay Safe:</strong> Exercise caution when meeting new people. Meet in public places and trust your instincts.</li>
                        <li><strong>Authenticity:</strong> Use your real name and provide accurate information about your activities.</li>
                        <li><strong>No Spam:</strong> Do not use the platform for unauthorized advertising or spam.</li>
                    </ul>
                    <p>Violating these guidelines may result in account suspension or termination.</p>
                </div>
            </div>
        </div>
    );
};

export default Guidelines;
