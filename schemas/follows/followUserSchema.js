const Joi = require('joi');

const followUserParams = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required'
    })
});

const followUserSchema = {
    params: followUserParams
};

module.exports = followUserSchema;
