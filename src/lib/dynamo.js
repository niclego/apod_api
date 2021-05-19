const { config, DynamoDB } = require('aws-sdk')

class Dynamo {
    static instance;
    client;

    constructor(region = 'us-east-2') {
        config.update({region});
        this.client = new DynamoDB.DocumentClient();
    }

    static getInstance() {
        if (!Dynamo.instance) {
            Dynamo.instance = new Dynamo();
        }

        return Dynamo.instance;
    }

    async query(params) {
        try {
            return await this.client.query(params).promise()
        } catch (err) {
            console.log("Error query", err);
            throw err;
        }
    }

    async get(params) {
        try {
            return await this.client.get(params).promise()
        } catch (err) {
            console.log("Error get", err);
            throw err;
        }
    }

    async put(params) {
        try {
            return await this.client.put(params).promise()
        } catch (err) {
            console.log("Error put", err);
            throw err;
        }
    }

    async update(params) {
        try {
            return await this.client.update(params).promise()
        } catch (err) {
            console.log("Error update", err);
            throw err;
        }
    }

    async delete(params) {
        try {
            return await this.client.delete(params).promise()
        } catch (err) {
            console.log("Error delete", err);
            throw err;
        }
    }

    createQueryParams(
        tableName, 
        sortKeyName, 
        sortKeyValue, 
        rangeKeyName, 
        rangeKeyValue,
        nextToken,
        strongConsistency, 
    
    ) {
        let params = {
            TableName: tableName,
            Limit: '10',
            KeyConditionExpression: '#type = :type',
            ExpressionAttributeNames: {
                '#type': sortKeyName
            },
            ExpressionAttributeValues: {
                ':type': sortKeyValue
            }
        };
    
        if (!!rangeKeyName && !!rangeKeyValue) {
            params['ExpressionAttributeNames'] = {
                ...params.ExpressionAttributeNames,
                ['#rangeKeyName']: rangeKeyName
            };
    
            params['ExpressionAttributeValues'] = {
                ...params.ExpressionAttributeValues,
                [':rangeKeyValue']: rangeKeyValue
            };
    
            const keyConditionExpression = ' AND begins_with(#rangeKeyName, :rangeKeyValue)';
            params['KeyConditionExpression'] += keyConditionExpression;
        }
    
        if (!!strongConsistency) {
            params['ConsistentRead'] = true;
        }
        return params;
    }
    
    createPutParams(
        tableName, 
        sortKeyName, 
        sortKeyValue, 
        rangeKeyName, 
        rangeKeyValue,
        attributes
    ) {
        var params = {
            Item: {},
            TableName: tableName
        };

        params.Item[sortKeyName] = sortKeyValue;
        params.Item[rangeKeyName] = rangeKeyValue;
        params.Item = {
            ...params.Item,
            ...attributes
        }

        return params
    }

    createUpdateParams(
        tableName, 
        sortKeyName, 
        sortKeyValue, 
        rangeKeyName, 
        rangeKeyValue,
        attributes
    ) {
        var params = {
            TableName: tableName,
            Key: {
                sortKeyName: sortKeyValue,
                rangeKeyName: rangeKeyValue
            }
        };
    }
}

module.exports.Dynamo = Dynamo;