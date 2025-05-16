const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const messageSchema = new Schema({
    sender:{
        type: Types.ObjectId,
        ref: 'Users',
        required: true
    },
    owner:{
        type: Types.ObjectId,
        ref: 'Users',
        required: true
    },
    content: {
        type : String,
        required:true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const message = model("Message", messageSchema);
module.exports = message;