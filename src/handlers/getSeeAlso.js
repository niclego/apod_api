const { createLambdaResponse } = require('../utils/helperFunctions')
const { Dynamo } = require('../lib/dynamo');
const dynamo = new Dynamo();

const handler = async (event, context, callback) => {
    console.log("[getSeeAlso.handler event]", event);
    event = typeof event === 'string' ? JSON.parse(event) : event;

    if (!event.pathParameters || !event.pathParameters.type || !event.pathParameters.date) {
        callback(null, createLambdaResponse(400, { message: 'date is missing from path.' }));
    }

    const type = event.pathParameters.type;
    let date = event.pathParameters.date;
    const dateArr = date.split("-");
    date = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2].charAt(0);

    try {
        let resp = await queryDynamo(type, date);
        
        // TODO filter resp of all items w/o images
        resp.Items = resp.Items.filter(item => !item.url.includes("youtube"));
        
        callback(null, createLambdaResponse(200, resp));
    } catch(err) {
        callback(null, createLambdaResponse(400, err.message));
    }
}

const queryDynamo = async (type, date) => {
    const params = dynamo.createQueryParams({
        TableName: "APODMasterTable",
        PartitionKeyName: "type",
        PartitionKeyValue: type,
        SortKeyName: "id",
        SortKeyValue: date,
        // KeyConditionExpression: ' AND #sortKeyName <= :sortKeyValue',
        Limit: 10,
        ProjectionExpression: "#url, #type, id",
        ProjectExpressionVariables: {"#url": "url", "#type": "type"},
        ScanIndexForward: false
    });
    
    console.log("[getSeeAlso.queryDynamo dynamodb query params]", params);

    return await dynamo.query(params);
}

module.exports.handler = handler;