const Donation = require('../models/donations');
const axios = require('axios');
const crypto = require('crypto');
const queryString = require('query-string');
const _ = require('underscore');
const DonationErrors = require('../Errors/DonationErrors');

const httpClient = axios.create({
    baseURL: process.env.KASHIER_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.KASHIER_SECRET_KEY,
        'api-key': process.env.KASHIER_API_KEY,
    }
});


const createPaymentSessionFromProvider = async (amount) => {
    try {
        const order = `DONATION-${Date.now()}`;
        
        // Validate environment variables
        if (!process.env.KASHIER_MERCHANT_ID || !process.env.WEBHOOK_URL) {
            throw new Error('Missing required environment variables');
        }
        
        const response = await httpClient.post('/v3/payment/sessions', {
            paymentType: "credit",
            amount: amount.toString(),
            currency: "EGP",
            order: order,
            display: "en",
            allowedMethods: "card,wallet",
            merchantRedirect: "https://example.com/redirect",
            redirectMethod: null,
            failureRedirect: false,
            iframeBackgroundColor: "#FFFFFF",
            merchantId: process.env.KASHIER_MERCHANT_ID,
            brandColor: "#5020FF",
            defaultMethod: "card",
            description: `Payment for order ${order}`,
            manualCapture: false,
            saveCard: "none",
            interactionSource: "ECOMMERCE",
            enable3DS: true,
            serverWebhook: process.env.WEBHOOK_URL,
            notes: "please support our blog"
        });
        
        if (!response || !response.data) {
            throw new Error('Invalid response from payment provider');
        }
        
        return response.data;
        
    } catch (error) {
        console.error('Payment session creation failed:', error.message);
        console.error('Error details:', error.response?.data || error);
        throw error; // Re-throw to be caught by controller
    }
};
const createDonation = async (donationData) => {
    const donation = await Donation.create(donationData);
    return donation;
};

const handelWebhook = (data, signatureHeader) => {
    data.signatureKeys.sort();
    const objectSignaturePayload = _.pick(data, data.signatureKeys);
    const signaturePayload = queryString.stringify(objectSignaturePayload);
    const signature = crypto
        .createHmac('sha256', process.env.KASHIER_API_KEY)
        .update(signaturePayload)
        .digest('hex');

    if (signatureHeader === signature) {
        return true;
    } else {
        return false;
    }
};

const updateDonationStatus = async (body) => {
    const { data, event } = body;
    const donation = await Donation.findOne({ orderId: data.merchantOrderId });
    if (!donation) {
        throw  DonationErrors.DonationNotFound;
    };
    const updateQuery = {
        $set: {
            status: data.status === "SUCCESS" ? "PAID" : "FAILED",
            webhookData: body,
        }
    };
    await Donation.updateOne({ _id: donation._id }, updateQuery);
};

module.exports = {
    createPaymentSessionFromProvider,
    createDonation,
    handelWebhook,
    updateDonationStatus
};