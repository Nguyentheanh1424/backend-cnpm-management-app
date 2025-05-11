const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const customerSchema = new Schema(
    {
        name: {
            type: String,
        },

        phone: {
            type: String,
            required: true,
        },

        email: {
            type: String,
        },

        rate: {
            type: Number,
            default:0,
        },

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

        money:{
            type:String,
            default:"0.000",
        },

        lastPurchaseDate: {
            type: Date ,
            default:null,
        },

        firstPurchaseDate: {
            type: Date ,
            default:null,
        },
    },
    {
        timestamps: true,
    }
);

const customer = model('Customer', customerSchema);

module.exports = customer;
