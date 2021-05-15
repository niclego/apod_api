function createLambdaResponse(status, body) {
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: status,
        body: JSON.stringify(body)
    }
}

module.exports = {
    createLambdaResponse
}