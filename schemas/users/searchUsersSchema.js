const Joi = require('joi');

const searchUsersQuery = Joi.object({
    q: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'Search query cannot be empty',
        'any.required': 'Search query is required'
    }),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
});

const searchUsersSchema = {
    query: searchUsersQuery
};

module.exports = searchUsersSchema;
