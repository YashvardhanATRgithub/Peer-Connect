const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

/**
 * @desc    Get all activities (filtered by college)
 * @route   GET /api/activities
 * @access  Public (requires college query)
 */
router.get('/', async (req, res) => {
    try {
        const college = req.query.college;
        if (!college) {
            return res.status(400).json({ message: 'College is required to view activities' });
        }

        const activities = await Activity.find({ college })
            .populate('creator', 'name avatar')
            .sort({ date: 1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Create a new activity
 * @route   POST /api/activities
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    const { title, category, date, time, location, description, capacity } = req.body;

    try {
        const activity = new Activity({
            title,
            category,
            date,
            time,
            location,
            description,
            capacity,
            creator: req.user._id,
            participants: [req.user._id], // Creator joins automatically
            college: req.user.college,
        });

        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Get activity by ID
 * @route   GET /api/activities/:id
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
            .populate('creator', 'name avatar')
            .populate('participants', 'name avatar')
            .populate('waitlist', 'name avatar');

        if (activity) {
            res.json(activity);
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Join an activity
 * @route   POST /api/activities/:id/join
 * @access  Private
 */
router.post('/:id/join', protect, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (activity) {
            // Check if already joined
            if (activity.participants.includes(req.user._id)) {
                return res.status(400).json({ message: 'Already joined' });
            }
            if (activity.waitlist.includes(req.user._id)) {
                return res.status(400).json({ message: 'Already on waitlist' });
            }

            if (activity.participants.length < activity.capacity) {
                activity.participants.push(req.user._id);
                await activity.save();
                res.json({ message: 'Joined successfully', status: 'joined' });
            } else {
                activity.waitlist.push(req.user._id);
                await activity.save();
                res.json({ message: 'Added to waitlist', status: 'waitlist' });
            }
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Leave an activity
 * @route   POST /api/activities/:id/leave
 * @access  Private
 */
router.post('/:id/leave', protect, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (activity) {
            // Remove from participants
            if (activity.participants.includes(req.user._id)) {
                activity.participants = activity.participants.filter(
                    (id) => id.toString() !== req.user._id.toString()
                );

                // Move first person from waitlist to participants if available
                if (activity.waitlist.length > 0) {
                    const nextUser = activity.waitlist.shift();
                    activity.participants.push(nextUser);
                }

                await activity.save();
                res.json({ message: 'Left successfully' });
            }
            // Remove from waitlist
            else if (activity.waitlist.includes(req.user._id)) {
                activity.waitlist = activity.waitlist.filter(
                    (id) => id.toString() !== req.user._id.toString()
                );
                await activity.save();
                res.json({ message: 'Removed from waitlist' });
            } else {
                res.status(400).json({ message: 'Not joined' });
            }
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Update an activity
 * @route   PUT /api/activities/:id
 * @access  Private (creator only)
 */
router.put('/:id', protect, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        if (activity.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this activity' });
        }

        const fields = ['title', 'category', 'date', 'time', 'location', 'description', 'capacity'];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                activity[field] = req.body[field];
            }
        });

        const updated = await activity.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Delete an activity
 * @route   DELETE /api/activities/:id
 * @access  Private (creator only)
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        if (activity.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this activity' });
        }

        await activity.deleteOne();
        res.json({ message: 'Activity deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
