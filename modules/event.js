const mongoose = require('mongoose');

const { Schema, Types, model } = mongoose;

const eventSchema = new Schema({
    task:{
        type: String,
        required: true,
        trim: true,
    },
    employee:{
        type: String,
        required: true,
        trim: true,
    },
    start_time:{
        type: Date,
        required: true,
    },
    end_time:{
        type: Date,
        required: true,
    },
    id_owner:{
        type : Types.ObjectId,
        ref : 'User',
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

const event = model('Event', eventSchema);

module.exports = event;