const { createLambdaResponse } = require('../utils/helperFunctions')
const { Dynamo } = require('../lib/dynamo');
const dynamo = new Dynamo();

const handler = async (event, context, callback) => {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    try {
        console.log("postComment event", event);

        const {
            type,
            commentText,
            author,
            likes
        } = body;
 
        comment = {
            type,
            id: Math.floor(Date.now() / 1000),
            commentText,
            author,
            likes
        }

        await postComment(comment)

        // Do I need to await this?
        incrementApodLikes(type)
        callback(null, createLambdaResponse(200, {message: "success"}));
    } catch(err) {
        console.log(err);
        callback(null, createLambdaResponse(400, err.message));
    }
};

const postComment = async (comment) => {
    const {
        type,
        id,
        commentText,
        author,
        likes
    } = comment;

    const attributes = {
        commentText,
        author,
        likes
    };

    const params = dynamo.createPutParams("APODCommentTable", "type", type, "id", id, attributes);
    console.log("[postComment dynamodb put params]", params);

    return await dynamo.put(params);
}

const incrementApodLikes = async (commentType) => {
    const type = commentType.split("#")[0];
    const date = commentType.split("#")[1];

    const attributes = {
        TableName: "APODMasterTable",
        PartitionKeyName: "type",
        PartitionKeyValue: type,
        SortKeyName: "id",
        SortKeyValue: date,
        UpdateExpression: "SET comments = comments + :val",
        ExpressionAttributeValues: { ":val": 1 }
    };
    
    const params = dynamo.createUpdateParams(attributes);
    console.log("[postComment dynamodb update params]", params);

    return await dynamo.update(params);
}

module.exports.handler = handler;