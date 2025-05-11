const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const orderHistorySchema = new Schema(
    {
        supplierId: {
            type: Types.ObjectId,
        },

        generalStatus: {
            type: String,
        },

        amount: {
            type: String,
        },

        tax: {
            type: Number,
        },

        ownerId: {
            type: Types.ObjectId},
    },
    {
        timestamps: true,
    }
);

const orderHistory = model('OrderHistory', orderHistorySchema);

module.exports = orderHistory;