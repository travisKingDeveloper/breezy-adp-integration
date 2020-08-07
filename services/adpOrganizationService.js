const fs = require('fs')
const adpConnectService = require('./adpConnectService')
const request = require('request-promise-native')
const { CERTS } = require('../config')

const credentialsReadUrl = 'https://api.adp.com/events/core/v1/consumer-application-subscription-credentials.read'
const root = '[ADP-ORGANIZATION]'
async function getOrganizationCredentials(organizationId) {
  try {
    const { accessToken } = await adpConnectService.getBreezyAccessToken()

    const body = {
      "events" : [
        {
          "serviceCategoryCode" : {
            "codeValue" : "core"
          },
          "eventNameCode" : {
            "codeValue" : "consumer-application-subscription-credential.read"
          },
          "data" : {
            "transform" : {
              "queryParameter" : `$filter=subscriberOrganizationOID eq '${organizationId}'`
            }
          }
        }
      ]
    }

    const organizationCredentials = await request.post(credentialsReadUrl, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        roleCode: 'administrator'
      },
      body,
      key: fs.readFileSync(CERTS.KEY_PATH),
      cert: fs.readFileSync(CERTS.CERT_PATH),
      json: true,
    })

    console.log('Credentials ', organizationCredentials)

    return organizationCredentials

  } catch (err) {
    console.error(root, 'Error Fetching Client Credentials')

    throw err
  }
}

module.exports = {
  getOrganizationCredentials
}
