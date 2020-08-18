const crypto = require('crypto')
const { uuid } = require('uuidv4')
const request = require('request-promise-native')
const { EVENTS_AUTH } = require('../../config')
const { saveEvent } = require('../../services/integrationEventService')

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
      oauth_consumer_key: EVENTS_AUTH.CONSUMER_KEY,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: "1.0",
    }, {})

    const text = `GET&${encodeURIComponent(urlWithoutQueryParams)}&${encodeURIComponent(formattedParams)}`
    const key = `${EVENTS_AUTH.CONSUMER_SECRET}&` //Token shared secret is not in the requests given
    let computedHash = crypto.createHmac('sha1', key).update(text).digest().toString('base64')

    const signature = encodeURIComponent(computedHash)

    const eventResponse = (await request.get(eventUrl, {
      headers: {
        "Accept": "application/JSON",
        "Authorization": `OAuth oauth_consumer_key="${EVENTS_AUTH.CONSUMER_KEY}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${timestamp}",oauth_nonce="${nonce}",oauth_signature="${signature}",oauth_version="1.0"`
      }
    }).catch(err => {
      console.error(`[ADP-FETCH-EVENT] Error fetching from url ${eventUrl}`)

      throw err
    }))

    req.event = JSON.parse(eventResponse)


    await saveEvent(req.event)

    if (!req.event.payload) {
      throw new Error(`Payload is not available for event: ${eventUrl}`)
    }

    next()
  } catch(err) {
    console.error('[ADP-FETCH-EVENT] an unexpected error occurred', err.message)
    next(err)
  }
}

module.exports = {
  fetchEvent
}