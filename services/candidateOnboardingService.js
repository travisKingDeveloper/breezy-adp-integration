const fs = require('fs')
const integrationService = require('./integrationService')
const adpConnectService = require('./adpConnectService')
const request = require('request-promise-native')
const { CERTS } = require('../config')
const candidateService = require('./candidateService')
const { createWorkerRequest } = require('../models/worker')

const onboardWorkersUrl = 'https://api.adp.com/events/staffing/v1/applicant.onboard'
const onboardWorkersUrlMeta = 'https://api.adp.com/events/staffing/v1/applicant.onboard/meta'

const baseADPUrl = 'https://api.adp.com'
async function onboardWorkers(companyId, candidateIds) {

  const { client_id, client_secret } = await integrationService.getIntegrationRun({ companyId })

  const { accessToken } = await adpConnectService.getBreezyTokenOnBehalfOfOrganization({
    clientSecret: client_secret,
    clientId: client_id,
  })

  const responses = []

  for (const { candidate_id } of candidateIds) {
    const candidate = await candidateService.getCandidate(companyId, candidate_id)

    const firstName = candidate.name.split(' ')[0].trim()
    const lastName = candidate.name.split(' ').slice(-1).join(' ').trim()

    let gender = ''
    if (candidate.eeoc && candidate.eeoc.gender) {
      gender = candidate.eeoc.gender.toLowerCase() === 'male' ? 'M' : 'F'
    }

    const worker = createWorkerRequest({
      firstName,
      lastName,
      number: candidate.phone_number,
      email: candidate.email_address,
      positionType: candidate.position.type.id,
      gender,
      workingHours: 40,
    })

    console.log('Attempting to post worker for candidate ', candidate_id)
    const response = await postWorker(accessToken, worker)

    responses.push(response)
  }

  return responses
}

async function fetchMeta(companyId) {
  const { client_id, client_secret } = await integrationService.getIntegrationRun({ companyId })

  const { accessToken } = await adpConnectService.getBreezyTokenOnBehalfOfOrganization({
    clientSecret: client_secret,
    clientId: client_id,
  })

  const meta = (await getMeta(accessToken)).meta['/data/transforms'][0]

  const metaMapped = Object.keys(meta).map(metaKey => ({ key: metaKey, obj: meta[metaKey]}))
  const metaModel = transformMeta(metaMapped, accessToken)

  return metaModel
}

function getMeta(accessToken) {
  return request.get(onboardWorkersUrlMeta, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      roleCode: 'Practitioner'
    },
    key: fs.readFileSync(CERTS.KEY_PATH),
    cert: fs.readFileSync(CERTS.CERT_PATH),
    json: true,
  })
}

function postWorker(accessToken, body) {
  return request.post(onboardWorkersUrl, {
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

// TODO TKING Make sure that this transform makes a viable meta to try and understand later on down the line
// meta [ { key, obj } ]
async function transformMeta(meta, accessToken) {
  const sorted =  meta
    .sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0))

  let transformed = {}
  for (let i in sorted) {
    let sortedItem = sorted[i]
      // kill the first /
      const newKey = sortedItem.key.slice(1, sortedItem.key.length)
      const keys = newKey.split('/').reverse()

      let intermidiaryObject = transformed
      //Walk the line
      while(keys.length - 1 > 0) {
        intermidiaryObject = intermidiaryObject[keys.pop()]

        if (Array.isArray(intermidiaryObject)) {
          intermidiaryObject = intermidiaryObject[0]
        }
      }

      console.log(Object.keys(sortedItem.obj))
      if (sortedItem.obj.dataType === 'object') {
        intermidiaryObject[keys[0]] = {}
        const mappedObject = intermidiaryObject[keys[0]]

        if (sortedItem.obj.codeList) {
          mappedObject.codeList = sortedItem.obj.codeList

          const currentCodeList =  intermidiaryObject[keys[0]].codeList

          if (currentCodeList.links) {
            const link = currentCodeList.links[0]
            if (link.method === 'GET') {
              currentCodeList.listItems = (await getRoute(link.href, accessToken)).codeLists[0].listItems
              delete currentCodeList.links
            }
          }
        }

      } else if (sortedItem.obj.dataType === 'array') {
        intermidiaryObject[keys[0]] = [{}]
      } else {
        intermidiaryObject[keys[0]] = sortedItem.obj
      }
    }

    return transformed
}

async function getRoute(route, accessToken) {
  return request.get(`${baseADPUrl}${route}`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      roleCode: 'Practitioner'
    },
    key: fs.readFileSync(CERTS.KEY_PATH),
    cert: fs.readFileSync(CERTS.CERT_PATH),
    json: true,
  })
}

module.exports = {
  onboardWorkers,
  fetchMeta,
}
