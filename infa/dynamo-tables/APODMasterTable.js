var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});

var dynamodb = new AWS.DynamoDB();

var params = {
    AttributeDefinitions: [
       {
      AttributeName: "TYPE", 
      AttributeType: "S"
     }, 
       {
      AttributeName: "ID", 
      AttributeType: "S"
     }
    ], 
    KeySchema: [
       {
      AttributeName: "TYPE", 
      KeyType: "HASH"
     }, 
       {
      AttributeName: "ID", 
      KeyType: "RANGE"
     }
    ], 
    ProvisionedThroughput: {
     ReadCapacityUnits: 1, 
     WriteCapacityUnits: 1
    }, 
    TableName: "APODMasterTable"
};

dynamodb.createTable(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});