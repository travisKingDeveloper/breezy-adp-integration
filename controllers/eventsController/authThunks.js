const authorization = require('auth-header')
const crypto = require('crypto')
const { uuid } = require('uuidv4')
const request = require('request-promise-native')
const { AUTH } = require('../../config')
const { saveEvent, errorCodes } = require('../../services/integrationEventService')

function formatParameters(oauth, queryParams) {
  const params = {
    ...oauth,
    ...queryParams,
  }

  delete params['oauth_signature']

  const paramList = Object.keys(params)
    .sort()
    .reduce((prev, curr) => {
      const condensed = `${encodeURIComponent(curr)}=${encodeURIComponent(params[curr])}&`
      return prev + condensed
    }, '')

  const formatted = paramList.substring(0, paramList.length-1)
  return formatted
}

function validateOAuthSignature(req, res, next) {
  const root = '[ADP-VALIDATE-OAUTH-SIGNATURE]'
  const auth = authorization.parse(req.headers.authorization)

  const oauthSignature = auth.params.oauth_signature
  const consumerKey = auth.params.oauth_consumer_key
  const signatureMethod = auth.params.oauth_signature_method

  if (!oauthSignature) {
    console.error(root, 'Could not validate signature because it was not present on the request')
    const err = new Error(`${root} oauth_signature: NOT FOUND`)
    err.status = errorCodes.UNAUTHORIZED
    err.response = "Unable to authenticate Client"
    return next(err)
  }

  if (consumerKey !== AUTH.CONSUMER_KEY) {
    console.error(root, 'AUTH Consumer Key is incorrect')
    const err = new Error(`${root}  Incorrect Consumer Key EXPECTED: ${AUTH.CONSUMER_KEY} RECEIVED: ${consumerKey}`)
    err.status = errorCodes.UNAUTHORIZED
    err.response = "Unable to authenticate Client"
    return next(err)
  }

  if (signatureMethod !== 'HMAC-SHA1') {
    console.error(root, 'AUTH Signature Method incorrect')
    const err = new Error(`${root} Incorrect Signature Method EXPECTED: HMAC-SHA1 RECEIVED: ${signatureMethod}`)
    err.status = errorCodes.UNAUTHORIZED
    err.response = "Unable to authenticate Client"
    return next(err)
  }

  //TODO TKING Handle Nonce Attacks
  const urlWithoutQueryParams = req.originalUrl.split('?')[0]
  const requestUri = `${req.protocol}://${req.get('Host')}${urlWithoutQueryParams}`;

  const formattedParams = formatParameters(auth.params, req.query)

  const text = `${req.method}&${encodeURIComponent(requestUri)}&${encodeURIComponent(formattedParams)}`
  const key = `${AUTH.CONSUMER_SECRET}&` //Token shared secret is not in the requests given

  console.log(`${root} text used: ${text} key used: ${key}`)
  const computedHash = crypto.createHmac('sha1', key).update(text).digest().toString('base64')
  const encodedComputedHash = encodeURIComponent(computedHash)


  console.log(`${root} Provided Hash: ${oauthSignature}, Computed Hash: ${encodedComputedHash} Equal? ${encodedComputedHash === oauthSignature}`)
  if (encodedComputedHash !== oauthSignature) {
    const err = new Error(`${root} Provided Hash and Computed Hash are not the same`)
    err.status = errorCodes.UNAUTHORIZED
    err.response = "Unable to authenticate Client"
    return next(err)
  }

  next()
}

async function fetchEvent(req, res, next) {
  try {
    const eventUrl = req.query.eventUrl

    if (!eventUrl) {
      return next(new Error('[ADP-FETCH-EVENT] could not fetch event because no eventUrl query parameter was found'))
    }

    const timestamp = new Date().getTime()
    const nonce = uuid()
    const [urlWithoutQueryParams, queryParams] = eventUrl.split('?')

    const formattedParams = formatParameters({
      oauth_consumer_key: AUTH.CONSUMER_KEY,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: "1.0",
    }, {})

    const text = `GET&${encodeURIComponent(urlWithoutQueryParams)}&${encodeURIComponent(formattedParams)}`
    const key = `${AUTH.CONSUMER_SECRET}&` //Token shared secret is not in the requests given
    let computedHash = crypto.createHmac('sha1', key).update(text).digest().toString('base64')

    console.log('stobbping')

    const signature = encodeURIComponent(computedHash)

    const eventResponse = (await request.get(eventUrl, {
      headers: {
        "Accept": "application/JSON",
        "Authorization": `OAuth oauth_consumer_key="${AUTH.CONSUMER_KEY}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${timestamp}",oauth_nonce="${nonce}",oauth_signature="${signature}",oauth_version="1.0"`
      }
    }).catch(err => {
      console.error(`[ADP-FETCH-EVENT] Error fetching from url ${eventUrl}`)

      throw err
    }))

    req.event = JSON.parse(eventResponse)

    await saveEvent(req.event)

    next()
  } catch(err) {
    console.error('[ADP-FETCH-EVENT] an unexpected error occurred', err.message)
    next(err)
  }
}

module.exports = {
  validateOAuthSignature,
  fetchEvent
}