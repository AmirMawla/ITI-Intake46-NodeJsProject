const Joi = require('joi');

const logInBody = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
    }),
    password: Joi.string().min(8).max(32).required(),
}).required();

const logInSchema = {
    body: logInBody,
}

module.exports = logInSchema;