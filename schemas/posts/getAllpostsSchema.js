const joi = require('joi') ;

const getallpostsquery = joi.object(
    {
        limit : joi.number().default(10) ,
        page : joi.number().default(1)
    }
)

const GetAllPostsSchema = {
    query : getallpostsquery 
}

module.exports = GetAllPostsSchema ;