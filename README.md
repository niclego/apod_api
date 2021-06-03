# apod_api

A Picture A Day Javascript/Node + Serverless  + AWS backend api. 

This backend service will first query a DynamoDB table for cached responses.
If there are no cached responses, this service will query the NASA APOD api and cache the response.

This repo also holds infrastructure code for creating DynamoDB tables.

## Technology Used

- Javascript
- Node
- Serverless
- aws-sdk (npm package)
- DynamoDB
- NASA APOD api

## Endpoints

- getApod
- getComments
- getSeeAlso
- postComment

## License

MIT
