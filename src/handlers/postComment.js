const { createLambdaResponse } = require('../utils/helperFunctions')
const { Dynamo } = require('../lib/dynamo');
const dynamo = new Dynamo();

const handler = async (event, context, callback) => {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    try {
        console.log("postComment event", event);

        if (!body.type) {
            throw "Please provide a type.";
        }

        const type = body.type;
        console.log("type", type);
        
        comment = {
            type,
            id:  20,
            commentText: "Hello World",
            author: "nlegorrec",
            likes: 0,
            createdAt: Date.now()
        }

        let resp = await postComment(comment)
    } catch(err) {
        callback(null, createLambdaResponse(400, err));
    }
};

const postComment = async (comment) => {
    const {
        type,
        id,
        commentText,
        author,
        likes,
        createdAt,
    } = comment;

    const attributes = {
        commentText,
        author,
        likes,
        createdAt,
    };

    const params = dynamo.createPutParams("APODCommentTable", "type", type, "id", id, attributes);
    console.log("[postComment dynamodb put params]", params);

    return await dynamo.put(params);
}

module.exports.handler = handler;