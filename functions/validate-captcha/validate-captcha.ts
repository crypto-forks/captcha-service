import {Handler} from "@netlify/functions";
import {validateRequest} from "./validateRequest";

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST'
};

function isDebug(body: any): boolean {
  try {
    return JSON.parse(body).debug != null
  } catch (e) {
    return false
  }
}

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
    let ret: any = {
      success: false,
      error: e?.toString(),
    }
    if (isDebug(event.body)) {
      ret = {
        ...ret,
        input: event,
        stack: e.stack?.split('\n')
      }
    }
    return {
      statusCode: 200, headers, body: JSON.stringify(ret)
    }
  }
}

export {handler}