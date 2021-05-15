const { createLambdaResponse } = require('../utils/helperFunctions')
const handler = async (event, context, callback) => {
    callback(null, createLambdaResponse(200, { message: 'success' }));
}

module.exports.handler = handler;