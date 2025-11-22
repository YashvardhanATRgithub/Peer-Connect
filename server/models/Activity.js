const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Sports', 'Study', 'Event', 'Other'],
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    capacity: {
        type: Number,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    waitlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    college: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
