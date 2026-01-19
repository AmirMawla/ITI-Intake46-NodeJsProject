const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true ,
            minlength: [3] ,
            maxlength: [30] 
        },
        email: {
            type: String,
            required: true ,
            unique: true 
            // match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/]
        },
        password: {
            type: String,
            required: true ,
            minlength: [8] ,
            maxlength: [32] 
            // match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/]
        },
        age: {
            type: Number,
            required: true ,
            min: [18] ,
            max: [100]
        },
        role: {
            type: String, 
            enum: ['admin', 'user']
        }
    },
    {timestamps: true}
) 


const User = mongoose.model('User', userSchema);

module.exports = User;