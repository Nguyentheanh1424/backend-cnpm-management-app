const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const userSchema = new Schema(
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
            default: null,
        },

        GoogleID: {
            type: String,
            default: null,
        },

        role: {
            type: String,
            default: "Admin",
        },

        id_owner: {
            type: Types.ObjectId,
            ref: 'User',
        },

        resetCode: {
            type: String,
        },

        resetCodeExpire: {
            type: Date,
        },

        avatar: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', function (next) {
    if (!this.id_owner) {
        this.id_owner = this._id;
    }

    // Gán avatar ngẫu nhiên nếu chưa có avatar
    if (!this.avatar) {
        // Tạo chuỗi ngẫu nhiên và tạo avatar từ chuỗi đó
        const randomSeed = Math.random().toString(36).substring(2);
        this.avatar = `https://api.dicebear.com/6.x/adventurer/svg?seed=${randomSeed}`;
    }

    next();
});

const user = model('User', userSchema);

module.exports = user;
