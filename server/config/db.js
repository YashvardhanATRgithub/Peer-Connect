const mongoose = require('mongoose');

let cached = null;

const connectDB = async () => {
    if (cached) return cached;
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        cached = conn;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
