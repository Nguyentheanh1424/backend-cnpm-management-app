const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const supplierSchema = new Schema(
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
    },
    {
        timestamps: true,
    }
);

const supplier = model("Supplier", supplierSchema);

module.exports = supplier;