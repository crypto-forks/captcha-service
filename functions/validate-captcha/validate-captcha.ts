// const {validateRequest} = require('./validateRequest')
import {Handler} from "@netlify/functions";
import {validateRequest} from "./validateRequest";

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST'
};

const handler: Handler = async (event, context) => {

  try {
    //config file created by create-config.js during site build
    // const config = require('./config.json')

    return {statusCode: 200, headers, body: JSON.stringify(await validateRequest(event))}
  } catch (e) {
    return {
      statusCode: 200, headers, body: JSON.stringify({
        success: false,
        input: event,
        error: e.toString(),
        stack: e.stack.split('\n')
      })
    }
  }
  /*
  {
      "path": "Path parameter",
      "httpMethod": "Incoming request's method name"
      "headers": {Incoming request headers}
      "queryStringParameters": {query string parameters }
      "body": "A JSON string of the request payload."
      "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
  }
  */
}

export {handler}