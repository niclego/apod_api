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

    createQueryParams(attributes) {
        const {
            TableName,
            PartitionKeyName,
            PartitionKeyValue,
            SortKeyName,
            SortKeyValue,
            StrongConsistency,
            ScanIndexForward,
            Limit,
            ProjectionExpression,
            ProjectExpressionVariables
        } = attributes;

        let params = {
            TableName: TableName,
            KeyConditionExpression: '#type = :type',
            ExpressionAttributeNames: {
                '#type': PartitionKeyName
            },
            ExpressionAttributeValues: {
                ':type': PartitionKeyValue
            }
        };
    
        if (!!SortKeyName && !!SortKeyValue) {
            params['ExpressionAttributeNames'] = {
                ...params.ExpressionAttributeNames,
                ['#sortKeyName']: SortKeyName,
            };
    
            params['ExpressionAttributeValues'] = {
                ...params.ExpressionAttributeValues,
                [':sortKeyValue']: SortKeyValue
            };
    
            const keyConditionExpression = ' AND begins_with(#sortKeyName, :sortKeyValue)';
            params['KeyConditionExpression'] += keyConditionExpression;
        }
    
        if (!!StrongConsistency) {
            params['ConsistentRead'] = StrongConsistency;
        }

        if (ScanIndexForward != undefined) {
            params['ScanIndexForward'] = ScanIndexForward;
        }

        if (!!Limit) {
            params["Limit"] = Limit
        }

        if(!!ProjectionExpression) {
            params["ProjectionExpression"] = ProjectionExpression;
        }

        if(!!ProjectExpressionVariables) {
            params['ExpressionAttributeNames'] = {
                ...params.ExpressionAttributeNames,
                ...ProjectExpressionVariables
            };
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

    createUpdateParams(attributes) {
        const {
            TableName,
            PartitionKeyName,
            PartitionKeyValue,
            SortKeyName,
            SortKeyValue,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        } = attributes;

        var params = {
            TableName: TableName,
            "Key": {},
            UpdateExpression,
            ExpressionAttributeValues,
            ExpressionAttributeNames
        };

        params["Key"][PartitionKeyName] = PartitionKeyValue;
        params["Key"][SortKeyName] = SortKeyValue;

        return params;

    }
}

module.exports.Dynamo = Dynamo;