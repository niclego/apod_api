const { createLambdaResponse } = require('../utils/helperFunctions')
const { Dynamo } = require('../lib/dynamo');
const dynamo = new Dynamo();

const handler = async (event, context, callback) => {
    console.log("[getComments.handler event]", event);
    event = typeof event === 'string' ? JSON.parse(event) : event;

    if (!event.pathParameters || !event.pathParameters.type  || !event.pathParameters.date) {
        callback(null, createLambdaResponse(400, { message: 'type and date required by path.' }));
    }

    const type = event.pathParameters.type;
    const date = event.pathParameters.date;
    const dynamoType = type + '#' + date;

    try {
        let resp = await queryDynamo(dynamoType);        
        callback(null, createLambdaResponse(200, resp));
    } catch(err) {
        callback(null, createLambdaResponse(400, err.message));
    }
}

const queryDynamo = async (type) => {
    const params = dynamo.createQueryParams({
        TableName: "APODCommentTable",
        PartitionKeyName: "type",
        PartitionKeyValue: type,
        ScanIndexForward: false,
        Limit: 20
    });

    console.log("[getComments.queryDynamo dynamodb query params]", params);

    return await dynamo.query(params);
}

module.exports.handler = handler;