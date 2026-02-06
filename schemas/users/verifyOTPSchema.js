const Joi = require('joi');

const verifyOTPBody = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
            'string.empty': 'OTP is required',
            'any.required': 'OTP is required'
        })
}).required();

const verifyOTPSchema = {
    body: verifyOTPBody
}

module.exports = verifyOTPSchema;
