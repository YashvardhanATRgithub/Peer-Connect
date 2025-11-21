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

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {activity.category}
                        </span>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900 line-clamp-1">{activity.title}</h3>
                    </div>
                    <div className="flex -space-x-2 overflow-hidden">
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
                    <div className="flex items-center text-sm text-slate-600">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        <span className="font-medium text-slate-900">{activity.participants.length}</span>
                        <span className="text-slate-500"> / {activity.capacity} joined</span>
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
                        src={activity.creator.avatar}
                        alt={activity.creator.name}
                    />
                    <span className="text-xs text-slate-500">Hosted by {activity.creator.name}</span>
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
    );
};

export default ActivityCard;
