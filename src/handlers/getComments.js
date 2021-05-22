const { createLambdaResponse } = require('../utils/helperFunctions')
const { Dynamo } = require('../lib/dynamo');
const dynamo = new Dynamo();

const handler = async (event, context, callback) => {
    console.log("[getComments.handler event]", event);
    event = typeof event === 'string' ? JSON.parse(event) : event;

    if (!event.pathParameters || !event.pathParameters.type) {
        callback(null, createLambdaResponse(400, { message: 'type is missing from path.' }));
    }

    const type = event.pathParameters.type;

    try {
        let resp = await queryDynamo(type);
        
        // TODO filter resp of all items w/o images
        
        callback(null, createLambdaResponse(200, resp));
    } catch(err) {
        callback(null, createLambdaResponse(400, err));
    }
}

const queryDynamo = async (type) => {

    // Table Name, Type name, Type value, Range name, Range value, Strong Consistency, Scan Index Forward, Limit, ProjectionExpression
    const params = dynamo.createQueryParams("APODCommentTable", "type", type, "id", null, false, false, 1);

    console.log("[getComments.queryDynamo dynamodb query params]", params);

    return await dynamo.query(params);
}

module.exports.handler = handler;