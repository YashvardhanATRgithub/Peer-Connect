import React from 'react';
import VideoBg from '../assets/video3.mp4';

const BackgroundVideo = ({ overlay = 'bg-white/0' }) => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
            className="w-full h-full object-cover"
            src={VideoBg}
            autoPlay
            loop
            muted
            playsInline
        />
        <div className={`absolute inset-0 ${overlay}`} />
    </div>
);

export default BackgroundVideo;
