const express = require('express');
const schemas = require('../schemas');
const donationsController = require('../controllers/donations');
const validate = require('../middlewares/validate');
const { Authentication } = require('../middlewares/Authentication');

const router = express.Router();


router.post("/", Authentication, validate(schemas.Donations.donateSchema), donationsController.createDonation);

router.post("/webhook", donationsController.webhook)


module.exports = router;
