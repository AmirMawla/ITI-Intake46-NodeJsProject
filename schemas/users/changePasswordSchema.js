const Joi = require('joi');

const changePasswordBody = Joi.object({
        currentPassword: Joi.string()
            .required()
            .messages({
                'string.empty': 'Current password is required',
                'any.required': 'Current password is required'
            }),
        newPassword: Joi.string()
            .min(8)
            .max(32)
            .required()
            .messages({
                'string.min': 'New password must be at least 8 characters',
                'string.max': 'New password cannot exceed 32 characters',
                'string.empty': 'New password is required',
                'any.required': 'New password is required'
            })
    }).required();

const changePasswordSchema = {
    body: changePasswordBody
}

module.exports = changePasswordSchema;