const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const historySchema = new Schema(
    {
        owner: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },

        employee: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },

        product: {
            type: String,
            required: true,
        },

        action: {
            type: String,
            enum: ['create', 'update', 'delete'],
            required: true,
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },

        details: {
            type: String,
        }
    }
);
const history= model('History', historySchema);

module.exports = history;
