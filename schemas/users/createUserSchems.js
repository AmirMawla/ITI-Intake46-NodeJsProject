const Joi = require('joi');

const createUserBody = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
    }),
    password: Joi.string().min(8).max(32).required(),
    repeatPassword: Joi.ref('password'),
    age: Joi.number().min(18).max(100).required(),
}).required();

const createUserSchema = {
    body: createUserBody,
}

module.exports = createUserSchema;