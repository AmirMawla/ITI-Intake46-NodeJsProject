const Joi = require('joi');

const markAsReadParams = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'Notification ID is required'
    })
});

const markAsReadSchema = {
    params: markAsReadParams
};

module.exports = markAsReadSchema;
