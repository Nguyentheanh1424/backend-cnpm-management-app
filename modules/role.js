const mongoose = require('mongoose');

const { Schema, model} = mongoose;

const roleSchema = new Schema(
    {
        role: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        permissions: {
            type: [String],
            default: []
        },

        createAt: {
            type: Date,
            default: Date.now
        },

        deleteAt: {
            type: Date,
            default: null
        },

        delete: {
            type: Boolean,
            default: false
        },

        id_owner: {
            type: mongoose.Schema.Types.ObjectId ,
            ref:"User",require:true
        },
    }
);

const role = model('Role', roleSchema);

module.exports = role;