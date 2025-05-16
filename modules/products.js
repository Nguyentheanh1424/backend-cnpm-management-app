const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const productSchema = new Schema(
    {
        owner: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
        },

        description: {
            type: String,
        },

        sku: { // mã định danh sản phẩm
            type: String,
            required: true,
        },

        price: {
            type: String,
            required: true,
        },

        stock_in_shelf: {
            type: Number,
            default: 0,
        },

        reorderLevel: {
            type: Types.ObjectId,
            ref: 'Suppliers',
            required: true,
        },

        purchaseDate: {
            type: Date,
            default: Date.now,
        },

        location: {
            type: String,
        },

        stock_in_Warehouse: {
            type: Number,
            default: 0},

        unit: {
            type: String,
            default: 'pcs'},

        purchasePrice: {
            type: String,
        },

        notes: {
            type: String,
        },

        image: {
            secure_url: String,
            public_id: String,
        },

        rate: {
            type: Number,
            default: 0
        },

        discount: {
            type: Number,
            default: 0,
        }
    }, {
        timestamps: true,
    }
);

const product = mongoose.model('Product', productSchema);

module.exports = product;