const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userTempSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        originalPassword: {
            type: String,
        },

        code: {
            type: String,
        },

        resetCodeExpire: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

const userTemp = model('UserTemp', userTempSchema);

module.exports = userTemp;
