var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});

var dynamodb = new AWS.DynamoDB();

var params = {
    AttributeDefinitions: [
       {
      AttributeName: "type", 
      AttributeType: "S"
     }, 
       {
      AttributeName: "id", 
      AttributeType: "N"
     }
    ], 
    KeySchema: [
       {
      AttributeName: "type", 
      KeyType: "HASH"
     }, 
       {
      AttributeName: "id", 
      KeyType: "RANGE"
     }
    ], 
    ProvisionedThroughput: {
     ReadCapacityUnits: 1, 
     WriteCapacityUnits: 1
    }, 
    TableName: "APODCommentTable"
};

dynamodb.createTable(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});