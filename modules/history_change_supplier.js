const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const supplierChangeHistorySchema = new Schema(
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

        supplier: {
            type: String,
            required: true,
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
        },
    },
    {
        timestamps: true,
    }
);

const supplierChangeHistory = model('SupplierChangeHistory', supplierChangeHistorySchema);

module.exports = supplierChangeHistory;
