import {Event} from "@netlify/functions/src/function/event";
import {signRelayRequest} from "@opengsn/paymasters";
import {privateToAddress} from "ethereumjs-util";

const recaptchaApiSiteVerify = "https://www.google.com/recaptcha/api/siteverify"

export async function validateRequest(event: Event) {

  const privkey = process.env.PRIVATE_KEY
  const recaptcha_secret_key = process.env.RECAPTCHA_SECRET_KEY

  console.log('privkey=', privkey)
  console.log('recap=',recaptcha_secret_key)

  const debug_skip_google = process.env.DEBUG_SKIP_GOOGLE
  // const {PRIVATE_KEY: privkey, RECAPTCHA_SECRET_KEY: recaptcha_secret_key, debug_skip_google} = process.env

  if (privkey == null)
    throw 'FATAL: must set env PRIVATE_KEY'
  if (recaptcha_secret_key == null)
    throw 'FATAL: must set env RECAPTCHA_SECRET_KEY'
  const private_key = Buffer.from(privkey, 'hex')
  const address = privateToAddress(private_key).toString()

  const req = JSON.parse(event.body as string)
  const {gresponse, userdata} = req

  if (!gresponse) throw new Error('missing input: gresponse')
  if (!userdata || !userdata.request || !userdata.requestData) throw new Error('missing input: userdata to sign')

  //userdata is the entire GSN request to sign
  //TODO: first uint256 in "userdata" is timestamp.
  // validate it is current (say ~1 minute from "now")
  // (to prevent user from "cooking" approval-data in advance)

  let gdata
  if (!debug_skip_google) {
    const res = await fetch(`${recaptchaApiSiteVerify}?secret=${recaptcha_secret_key}&response=${gresponse}`)
    if (!res.ok) {
      // NOT res.status >= 200 && res.status < 300
      return {statusCode: res.status, body: res.statusText}
    }
    gdata = await res.json()
    if (!gdata.success) {
      // site-verify "error-codes": probably "invalid-input-response" or "timeout-or-duplicate"
      return gdata
    }
  } else {
    gdata = {success: true, debug: true}
  }


  return {
    approvalData: signRelayRequest(userdata, private_key),
    address,
    ...gdata
  }
}
