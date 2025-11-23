import React from 'react';
import BackgroundVideo from '../components/BackgroundVideo';

const Support = () => {
    return (
        <div className="min-h-screen relative">
            <BackgroundVideo overlay="bg-orange-50/90" />
            <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Support Center</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
                    <p className="mb-4">Need help? We're here for you.</p>
                    <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
                    <div className="space-y-4 mb-6">
                        <div>
                            <p className="font-semibold">How do I join an activity?</p>
                            <p>Simply browse the Explore page and click "Join" on any activity that interests you.</p>
                        </div>
                        <div>
                            <p className="font-semibold">How do I create an activity?</p>
                            <p>Sign up or log in, then click "Create Event" on the dashboard or landing page.</p>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
                    <p>If you can't find the answer you're looking for, please reach out to our support team at <a href="mailto:support@peerconnect.com" className="text-primary hover:underline">support@peerconnect.com</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default Support;
