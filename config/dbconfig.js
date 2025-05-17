require('dotenv').config();
const logger = require('../config/logger');
const mongoose = require("mongoose");

class Database {
    constructor() {
        this.uri = process.env.MONGO_URI;
    }

    async connect() {
        try {
            logger.info(`Attempting to connect to MongoDB Atlas at ${this.uri.replace(/:.*@/, ':****@')}`);
            await mongoose.connect(this.uri);
            logger.info(`Successfully connected to MongoDB Atlas`);
        }
        catch (err) {
            logger.error(`MongoDB Atlas connection error: ${err.message}`);
            throw new Error(`Failed to connect to MongoDB Atlas`);
        }
    }
}

module.exports = new Database();
