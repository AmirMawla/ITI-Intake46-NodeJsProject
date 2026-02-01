const Joi = require('joi');

const updateUserBodySchema = Joi.object({
    name: Joi.string().min(3).max(32),
    email: Joi.string().email(),
    age: Joi.number().min(18).max(100),
}).required();

const updateUserParamsSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
}).required();


const UpdateUserschema = {
    body: updateUserBodySchema,
    params: updateUserParamsSchema,
}

module.exports = UpdateUserschema;