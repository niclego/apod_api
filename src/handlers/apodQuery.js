const { createLambdaResponse } = require('../utils/helperFunctions')
const { Dynamo } = require('../lib/dynamo');
const dynamo = new Dynamo();

const handler = async (event, context, callback) => {
    console.log("[apodQuery.handler event]", event);
    event = typeof event === 'string' ? JSON.parse(event) : event;

    if (!event.pathParameters || !event.pathParameters.type || !event.pathParameters.date) {
        callback(null, createLambdaResponse(400, { message: 'date is missing from path.' }));
    }

    const type = event.pathParameters.type;
    const date = event.pathParameters.date;

    try {
        let resp = await queryDynamo(type, date);

        // isSingleAPODQuery?
        if (resp.Count == 0 && date.split("-").length == 3) {
            const apodResp  = await getNasaApod(date);
            const {
                title,
                explanation,
                hdurl,
                url,
                copyright
            } = apodResp.data;

            resp = {
                "TYPE": type,
                "ID": date,
                explanation,
                hdurl,
                title,
                url,
                copyright
            }

            // Do I need to await this?
            cacheNasaApod(resp);
            callback(null, createLambdaResponse(200, resp));
        } else {
            console.log("[apodQuery.handler event] dynamodb hit!")
            if (resp.Count > 1)
                callback(null, createLambdaResponse(200, resp));
            else
                callback(null, createLambdaResponse(200, resp.Items[0]));
        }
    } catch(err) {
        callback(null, createLambdaResponse(400, err));
    }
}

const cacheNasaApod = async (resp) => {
    const {
        explanation,
        hdurl,
        title,
        url,
        copyright
    } = resp;

    const attributes = {
        explanation,
        hdurl,
        title,
        url,
        copyright
    };

    const params = dynamo.createPutParams("APODMasterTable", "TYPE", resp["TYPE"], "ID", resp["ID"], attributes);
    console.log("[apodQuery.cacheNasaApod dynamodb put params]", params);

    return await dynamo.put(params);
}

const queryDynamo = async (type, date) => {
    const params = dynamo.createQueryParams("APODMasterTable", "TYPE", type, "ID", date);
    console.log("[apodQuery.queryDynamo dynamodb query params]", params);

    return await dynamo.query(params);
}

const getNasaApod = async (date) => {
    const axios = require('axios').default;
    console.log("[apodQuery.getNasaApod date]", date);
    const apodUrl = "https://api.nasa.gov/planetary/apod?api_key=" + process.env.PRIVATE_NASA_KEY + "&date=" + date

    try {
        return await axios.get(apodUrl);
    } catch(err) {
        console.log("[apodQuery.getNasaApod err]", err);
        throw err.response.data;
    }
}

module.exports.handler = handler;