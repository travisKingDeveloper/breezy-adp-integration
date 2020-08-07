const fs = require('fs')
const integrationService = require('./integrationService')
const adpConnectService = require('./adpConnectService')
const request = require('request-promise-native')
const { CERTS } = require('../config')

const onboardWorkersUrl = 'https://api.adp.com/events/staffing/v1/applicant.onboard'
const onboardWorkersUrlMeta = 'https://api.adp.com/events/staffing/v1/applicant.onboard/meta'

const onboardWorkersUrl_2 = 'https://api.adp.com/hcm/v2/applicant.onboard'
const onboardWorkersUrlMeta_2 = 'https://api.adp.com/hcm/v2/applicant.onboard/meta'
async function onboardWorkers(companyId, workers) {

  const { client_id, client_secret } = await integrationService.getIntegrationRun({ companyId })

  const { accessToken } = await adpConnectService.getBreezyTokenOnBehalfOfOrganization({
    clientSecret: client_secret,
    clientId: client_id,
  })

  // const meta = (await getMeta(accessToken)).meta['/data/transforms'][0]
  const meta = (await getMeta2(accessToken)).meta['/data/transforms'][0]

  // const meta2_length = Object.keys(meta2).length
  const meta2_req = Object.keys(meta).map(metaKey => ({ key: metaKey, obj: meta[metaKey]}))

  // const metaModel = transformMeta(meta2_req)
  const metaModel2 = transformMeta(meta2_req)


  // const meta_length = Object.keys(meta).length
  // const meta_req = Object.keys(meta).reduce((prev, curr) => {
  //   if (meta[curr] && !meta[curr].optional) {
  //     meta[curr].prop =  curr
  //     return prev[curr] = meta[curr]
  //   }
  //
  //   return prev
  // }, {})

  // const body = { events: workerEvents }
  // const workerEvents = workers.map(mapWorker)
  const body = require('../models/_worker').sampleRequest

  const response = await postWorker(accessToken, body)

  return response
}

function getMeta2(accessToken) {
  return request.get(onboardWorkersUrlMeta_2, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      roleCode: 'practitioner'
    },
    key: fs.readFileSync(CERTS.KEY_PATH),
    cert: fs.readFileSync(CERTS.CERT_PATH),
    json: true,
  })
}

function getMeta(accessToken) {
  return request.get(onboardWorkersUrlMeta, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      roleCode: 'practitioner'
    },
    key: fs.readFileSync(CERTS.KEY_PATH),
    cert: fs.readFileSync(CERTS.CERT_PATH),
    json: true,
  })
}

function postWorker(accessToken, body) {
  return request.post(onboardWorkersUrl_2, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      roleCode: 'Practitioner'
    },
    body,
    key: fs.readFileSync(CERTS.KEY_PATH),
    cert: fs.readFileSync(CERTS.CERT_PATH),
    json: true,
  })
}

// meta [ { key, obj } ]
function transformMeta(meta) {
  const sorted =  meta
    .sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))

  return sorted
    .reduce((prev, curr) => {
      // kill the first /
      const newKey = curr.key.slice(1, curr.key.length)
      const keys = newKey.split('/').reverse()

      let intermidiaryObject = prev, i = 0
      //Walk the line
      while(keys.length -1 > 0) {
        intermidiaryObject = intermidiaryObject[keys.pop()]

        if (Array.isArray(intermidiaryObject)) {
          intermidiaryObject = intermidiaryObject[0]
        }
      }

      if (curr.obj.dataType === 'object') {
        intermidiaryObject[keys[0]] = {}
      } else if (curr.obj.dataType === 'array') {
        intermidiaryObject[keys[0]] = [{}]
      } else {
        intermidiaryObject[keys[0]] = curr.obj
      }


     return prev
    }, {})
}

module.exports = {
  onboardWorkers,
}
