const Joi = require('joi');

const forgotPasswordBody =  Joi.object({
        email: Joi.string()
            .email()
            .required()
            .trim()
            .lowercase()
            .messages({
                'string.email': 'Please provide a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            })
    }).required();

const forgotPasswordSchema = {
    body: forgotPasswordBody
}

module.exports = forgotPasswordSchema;