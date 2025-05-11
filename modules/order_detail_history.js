const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const orderDetailHistorySchema = new Schema(
    {
        orderId: {
            type: Types.ObjectId,
        },

        productId: {
            type: Types.ObjectId,
        },

        price: {
            type: String,
        },

        quantity: {
            type: String,
        },

        status: {
            type: String,
        },

        ownerId: {
            type: Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

const orderDetailHistory = model('OrderDetailHistory', orderDetailHistorySchema,);

module.exports = orderDetailHistory;