const Joi = require('joi');

const getBookmarksQuery = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
});

const getBookmarksSchema = {
    query: getBookmarksQuery
};

module.exports = getBookmarksSchema;
