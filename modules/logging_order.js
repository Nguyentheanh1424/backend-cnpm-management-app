const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const loggingOrderSchema = new Schema(
    {
        orderId: {
            type: Types.ObjectId,
        },

        orderDetailId: {
            type: Types.ObjectId,
        },

        status: {
            type: String,
        },

        userId: {
            type: Types.ObjectId,
        },

        userName: {
            type: String,
        },

        details: {
            type: String,
        },

        ownerId: {
            type: Types.ObjectId,
        },

        tax: {
            type:Number,
        },
    },
    {
        timestamps: true,
    }
);

const loggingOrder = model('LoggingOrder', loggingOrderSchema);
module.exports = loggingOrder;