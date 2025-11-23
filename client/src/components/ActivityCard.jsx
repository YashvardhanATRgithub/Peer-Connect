import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Button from './ui/Button';

const ActivityCard = ({ activity, onJoin, onLeave, onEdit, onDelete, currentUserId }) => {
    const getId = (p) => (typeof p === 'string' ? p : p?._id?.toString());
    const currentId = currentUserId?.toString();
    const isJoined = activity.participants.some(p => getId(p) === currentId);
    const isWaitlisted = activity.waitlist.some(p => getId(p) === currentId);
    const isCreator = getId(activity.creator) === currentId;
    const isFull = activity.participants.length >= activity.capacity;

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const [showModal, setShowModal] = React.useState(false);
    const [selectedParticipant, setSelectedParticipant] = React.useState(null);

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                {activity.category}
                            </span>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900 line-clamp-1">{activity.title}</h3>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowModal(true)}>
                            {activity.participants.slice(0, 3).map((p) => (
                                <img
                                    key={p._id}
                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                    src={p.avatar}
                                    alt={p.name}
                                />
                            ))}
                            {activity.participants.length > 3 && (
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-xs font-medium text-gray-500">
                                    +{activity.participants.length - 3}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">{activity.description || 'No description yet—click to see details.'}</p>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-slate-600">
                            <Calendar className="mr-2 h-4 w-4 text-primary" />
                            <span className="font-medium text-slate-900">{formatDate(activity.date)}</span>
                            <span className="mx-2 text-slate-400">•</span>
                            <Clock className="mr-2 h-4 w-4 text-primary" />
                            <span className="font-medium text-slate-900">{activity.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                            {activity.location}
                        </div>
                        <div className="flex items-center text-sm text-slate-600 cursor-pointer hover:text-primary transition-colors" onClick={() => setShowModal(true)}>
                            <Users className="mr-2 h-4 w-4 text-primary" />
                            <span className="font-medium text-slate-900 mr-1">{activity.participants.length}</span>
                            <span className="text-slate-500">/ {activity.capacity} joined</span>
                            {activity.waitlist.length > 0 && (
                                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                                    {activity.waitlist.length} waitlist
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            className="h-6 w-6 rounded-full mr-2"
                            src={activity.creator?.avatar || 'https://ui-avatars.com/api/?name=Unknown'}
                            alt={activity.creator?.name || 'Unknown'}
                        />
                        <span className="text-xs text-slate-500">Hosted by {activity.creator?.name || 'Unknown User'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isCreator && (
                            <>
                                <Button size="sm" variant="secondary" onClick={() => onEdit(activity._id)}>Edit</Button>
                                <Button size="sm" variant="outline" onClick={() => onDelete(activity._id)}>Delete</Button>
                            </>
                        )}
                        {!isCreator && (
                            <>
                                {isJoined ? (
                                    <Button size="sm" variant="outline" onClick={() => onLeave(activity._id)}>Leave</Button>
                                ) : isWaitlisted ? (
                                    <Button size="sm" variant="outline" onClick={() => onLeave(activity._id)}>Leave Waitlist</Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant={isFull ? "secondary" : "primary"}
                                        onClick={() => onJoin(activity._id)}
                                    >
                                        {isFull ? 'Join Waitlist' : 'Join'}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Participants Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-900">Participants</h3>
                            <button onClick={() => { setShowModal(false); setSelectedParticipant(null); }} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-0 max-h-[60vh] overflow-y-auto">
                            {selectedParticipant ? (
                                <div className="p-6 text-center">
                                    <img src={selectedParticipant.avatar} alt={selectedParticipant.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-slate-50 shadow-sm" />
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">{selectedParticipant.name}</h4>
                                    <p className="text-sm text-slate-500 mb-6">{selectedParticipant.email}</p>

                                    <div className="space-y-4 text-left bg-slate-50 rounded-xl p-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                                            <p className="text-slate-900 font-medium">{selectedParticipant.phoneNumber || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Interests</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedParticipant.interests && selectedParticipant.interests.length > 0 ? (
                                                    selectedParticipant.interests.map((interest, i) => (
                                                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white border border-slate-200 text-slate-700">
                                                            {interest}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-sm italic">No interests listed</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedParticipant(null)}
                                        className="mt-6 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        ← Back to list
                                    </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {activity.participants.length > 0 ? (
                                        activity.participants.map((p) => (
                                            <li
                                                key={p._id}
                                                onClick={() => setSelectedParticipant(p)}
                                                className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                                            >
                                                <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full border border-slate-200" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">{p.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{p.email}</p>
                                                </div>
                                                <svg className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </li>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-500">
                                            <p>No participants yet.</p>
                                        </div>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActivityCard;
