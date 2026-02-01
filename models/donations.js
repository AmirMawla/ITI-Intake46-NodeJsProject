const mongoose = require('mongoose');

// schema
const DonationSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
        default: "PENDING"
    },
    sessionURL: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    webhookData: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

// model
const DonationModel = mongoose.model('Donation', DonationSchema);


module.exports = DonationModel;
