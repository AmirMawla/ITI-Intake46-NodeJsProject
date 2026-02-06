const Joi = require('joi');

const searchPostsQuery = Joi.object({
    q: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'Search query cannot be empty',
        'any.required': 'Search query is required'
    }),
    tags: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
});

const searchPostsSchema = {
    query: searchPostsQuery
};

module.exports = searchPostsSchema;
