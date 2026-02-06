const Joi = require('joi');

const getFollowersQuery = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
});

const getFollowersParams = Joi.object({
    userId: Joi.string().required()
});

const getFollowersSchema = {
    query: getFollowersQuery,
    params: getFollowersParams
};

module.exports = getFollowersSchema;
