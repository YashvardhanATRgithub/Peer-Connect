import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Initialize socket outside component to prevent multiple connections
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const ChatModal = ({ activityId, activityTitle, participants = [], onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Join room
        socket.emit('join_room', activityId);

        // Listen for history
        socket.on('chat_history', (history) => {
            setMessages(history);
            scrollToBottom();
        });

        // Listen for new messages
        socket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        });

        return () => {
            socket.off('chat_history');
            socket.off('receive_message');
        };
    }, [activityId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        const selectionStart = e.target.selectionStart;
        setNewMessage(value);
        setCursorPosition(selectionStart);

        // Check for mention trigger
        const lastAt = value.lastIndexOf('@', selectionStart - 1);
        if (lastAt !== -1) {
            const query = value.substring(lastAt + 1, selectionStart);
            if (!query.includes(' ')) {
                setShowMentions(true);
                setMentionQuery(query);
                return;
            }
        }
        setShowMentions(false);
    };

    const handleMentionSelect = (participantName) => {
        const lastAt = newMessage.lastIndexOf('@', cursorPosition - 1);
        const prefix = newMessage.substring(0, lastAt);
        const suffix = newMessage.substring(cursorPosition);
        const updatedMessage = `${prefix}@${participantName} ${suffix}`;

        setNewMessage(updatedMessage);
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const filteredParticipants = participants.filter(p =>
        p.name.toLowerCase().includes(mentionQuery.toLowerCase()) &&
        p._id !== user._id // Don't mention self
    );

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            activityId,
            senderId: user._id,
            content: newMessage
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
        setShowMentions(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">Chat</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{activityTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
                    {messages.map((msg, index) => {
                        const isMe = msg.sender._id === user._id;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                                    {!isMe && (
                                        <img
                                            src={msg.sender.avatar}
                                            alt={msg.sender.name}
                                            className="w-8 h-8 rounded-full border border-slate-200 self-end"
                                        />
                                    )}
                                    <div>
                                        {!isMe && <p className="text-xs text-slate-500 ml-1 mb-0.5">{msg.sender.name}</p>}
                                        <div
                                            className={`px-4 py-2 rounded-2xl text-sm ${isMe
                                                ? 'bg-primary text-white rounded-br-none'
                                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <p className={`text-[10px] text-slate-400 mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Mention Suggestions */}
                {showMentions && filteredParticipants.length > 0 && (
                    <div className="border-t border-slate-100 bg-white max-h-40 overflow-y-auto shadow-lg">
                        {filteredParticipants.map(p => (
                            <div
                                key={p._id}
                                onClick={() => handleMentionSelect(p.name)}
                                className="flex items-center gap-2 p-2 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                                <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full" />
                                <span className="text-sm text-slate-700">{p.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Type a message... (@ to mention)"
                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
