/**
 * @ Author: Julian Hardtung
 * @ Create Time: 07.06.2023 17:36:09
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:12:56
 * 
 * Mongoose setup for connection to MongoDB
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err)
    }
}

module.exports = connectDB;