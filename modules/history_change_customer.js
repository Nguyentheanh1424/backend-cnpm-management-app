const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const customerChangeHistorySchema = new Schema(
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

        customer: {
            type:String,
            required:true,
        },

        action: {
            type: String,
            enum: ['update', 'delete'],
            required: true,
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },

        details: {
            type: String,
        }

    },
    {
        timestamps: true,
    }
);

const customerChangeHistory = model('CustomerChangeHistory', customerChangeHistorySchema);

module.exports = customerChangeHistory;
