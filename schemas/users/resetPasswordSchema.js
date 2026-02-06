const Joi = require('joi');

const resetPasswordBody = Joi.object({
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
    newPassword: Joi.string()
        .min(8)
        .max(32)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password cannot exceed 32 characters',
            'string.empty': 'New password is required',
            'any.required': 'New password is required'
        })
}).required();

const resetPasswordSchema = {
    body: resetPasswordBody
}

module.exports = resetPasswordSchema;