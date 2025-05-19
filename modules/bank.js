const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;

const BankAccountSchema = new Schema(
    {
    owner: {
        type: Types.ObjectId,
        ref : 'User' ,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    bankName: {
        type: String,
        required: true
    },

    accountNumber: {
        type: String,
        required: true
    },

},
    {
        timestamps: true
    }
);

const Banks = model('BankAccount', BankAccountSchema);

module.exports = Banks;
