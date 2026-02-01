const donationService = require('../services/donations');
const APIError = require('../Errors/APIError');
const DonationErrors = require('../Errors/DonationErrors');
const UserErrors = require('../Errors/UserErrors');

const createDonation = async (req, res) => {

    const { amount } = req.body;
    const { userId } = req.user;
    if (!userId) {
        throw  UserErrors.InvalidCredentialsError;
    };
    let session;
    // create payment session on the gateway
    try {
        session = await donationService.createPaymentSessionFromProvider(amount);
    } catch (error) {
        throw  DonationErrors.ServiceUnavailable;
    }
    // if success we will create donation object 
    const donationData = {
        sessionId: session._id,
        orderId: session.paymentParams.order,
        amount: session.paymentParams.amount,
        sessionURL: session.sessionUrl,
        userId: userId,
    }
    const donation = await donationService.createDonation(donationData);
    if (!donation) {
        throw new DonationErrors.InvalidDonationData;
    }
    // return sessionUrl for the provider

    res.status(200).json({
        message: "Donation Link created successfully",
        Data: {
            sessionURL: donation.sessionURL,
        }
    });

};


const webhook = async (req, res) => {
    const { data, event } = req.body;
    const kashierSignature = req.header('x-kashier-signature');
    const isValid = donationService.handelWebhook(data, kashierSignature);
    if (!isValid) {
        throw DonationErrors.InvalidSignature;
    }

    await donationService.updateDonationStatus(req.body);

    res.status(200).json({
        message: "Webhook received successfully",
    });
};



module.exports = {
    createDonation,
    webhook
};


