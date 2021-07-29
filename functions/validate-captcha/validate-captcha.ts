import {Handler} from "@netlify/functions";
import {validateRequest} from "./validateRequest";

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST'
};

const handler: Handler = async (event, context) => {
  if (event.httpMethod == 'OPTIONS') {
    return {
      statusCode: 200, // <-- Must be 200 otherwise pre-flight call fails
      headers,
      body: 'preflight'
    }
  }
  try {

    let res = await validateRequest(event);
    return {statusCode: 200, headers, body: JSON.stringify(res)}
  } catch (e) {
    console.log('=== failure', e, 'request=', event.body)
    return {
      statusCode: 200, headers, body: JSON.stringify({
        success: false,
        input: event,
        error: e?.toString(),
        stack: e.stack?.split('\n')
      })
    }
  }
}

export {handler}