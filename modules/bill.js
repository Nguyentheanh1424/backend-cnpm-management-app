const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const billSchema = new Schema(
    {
        owner: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },

        creator: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },

        customerId: {
            type: Types.ObjectId,
            ref: 'Customer',
        },

        orderDate: {
            type: Date,
            default: Date.now,
        },

        totalAmount: {
            type: String,
            required: true,
        },

        items: [
            {
                productID: {
                    type: Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },

                name: {
                    type: String,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                },

                price: {
                    type: String,
                    required: true,
                },

                discount: {
                    type: String,
                },

                totalAmount:{
                    type: String,
                }
            }
        ],

        discount:{
            type: String,
        },

        vat: {
            type: String,
        },

        paymentMethod: {
            type:String,
        },

        notes: {
            type: String,
        }
    }
);

const bill = model('Bill', billSchema);

module.exports = bill;