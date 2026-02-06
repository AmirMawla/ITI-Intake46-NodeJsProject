const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: [3],
            maxlength: [30]
        },
        email: {
            type: String,
            required: true,
            unique: true
            // match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/]
        },
        password: {
            type: String,
            required: true,
            minlength: [8],
            maxlength: [200]
            // match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/]
        },
        age: {
            type: Number,
            required: true,
            min: [18],
            max: [100]
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
            required: true
        },
        passwordResetOTP: {
            type: String,
            default: null
        },
        passwordResetExpires: {
            type: Date,
            default: null
        },
        otpVerified: {
            type: Boolean,
            default: false
        },
        profilePicture: {
            url: {
                type: String,
                default: null
            },
            fileId: {
                type: String,
                default: null
            }
        }
    },
    { timestamps: true }
)

userSchema.methods.isOTPExpired = function () {
    if (!this.passwordResetExpires) return true;
    return Date.now() > this.passwordResetExpires;
};


const User = mongoose.model('User', userSchema);

module.exports = User;