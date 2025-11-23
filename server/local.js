const app = require('./index');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const User = require('./models/User');
const Activity = require('./models/Activity');
const Notification = require('./models/Notification');
const { sendMail } = require('./utils/email');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_user_room', (userId) => {
        socket.join(userId);
        console.log(`User joined personal room: ${userId}`);
    });

    socket.on('join_room', async (activityId) => {
        socket.join(activityId);
        console.log(`User joined room: ${activityId}`);

        // Send chat history
        try {
            const messages = await Message.find({ activity: activityId })
                .populate('sender', 'name avatar')
                .sort({ createdAt: 1 });
            socket.emit('chat_history', messages);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    });

    socket.on('send_message', async (data) => {
        // data: { activityId, senderId, content }
        try {
            const newMessage = await Message.create({
                activity: data.activityId,
                sender: data.senderId,
                content: data.content
            });

            const populatedMessage = await newMessage.populate('sender', 'name avatar');

            io.to(data.activityId).emit('receive_message', populatedMessage);

            // Handle Mentions
            try {
                const activity = await Activity.findById(data.activityId).populate('participants');
                const sender = await User.findById(data.senderId);

                if (activity && sender) {
                    for (const participant of activity.participants) {
                        // Check if participant is mentioned (case-insensitive check for @Name)
                        const mentionString = `@${participant.name}`;
                        const contentLower = data.content.toLowerCase();
                        const mentionStringLower = mentionString.toLowerCase();

                        // Check if content includes the mention string
                        // We add a check to ensure we aren't matching a prefix of a longer name if possible,
                        // but since we are iterating known participants, simple inclusion is usually enough 
                        // and covers cases where name is at end of sentence.
                        if (contentLower.includes(mentionStringLower) && participant._id.toString() !== data.senderId) {
                            // Create Notification
                            await Notification.create({
                                recipient: participant._id,
                                sender: data.senderId,
                                activity: data.activityId,
                                type: 'mention'
                            });

                            // Send Email
                            const emailHtml = `
                                <div style="font-family: Arial, sans-serif; padding: 20px;">
                                    <h2>You were mentioned!</h2>
                                    <p><strong>${sender.name}</strong> mentioned you in a chat.</p>
                                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Chat</a>
                                </div>
                            `;

                            try {
                                await sendMail({
                                    to: participant.email,
                                    subject: 'You were mentioned in PeerConnect',
                                    html: emailHtml
                                });
                            } catch (err) {
                                console.error('Failed to send mention email:', err);
                            }

                            // Emit socket event
                            io.to(participant._id.toString()).emit('new_notification');
                        }
                    }
                }
            } catch (err) {
                console.error('Error handling mentions:', err);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
