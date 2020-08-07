const { SSO, DATA_CONNECTOR, CERTS } = require('../config')
const adpConnection = require('adp-connection')

const connectorConfigurationOpts = {
  clientId: DATA_CONNECTOR.CLIENT_ID,
  clientSecret: DATA_CONNECTOR.CLIENT_SECRET,
  granttype: 'client_credentials',
  sslCertPath: CERTS.CERT_PATH,
  sslKeyPath: CERTS.KEY_PATH,
}

const ssoConfigurationOpts = {
  clientId: SSO.CLIENT_ID,
  clientSecret: SSO.CLIENT_SECRET,
  granttype: 'authorization_code',
  sslCertPath: '/Users/travisking/Repositories/breezy-adp-integration/ssl/adp-cert.cer',
  sslKeyPath: '/Users/travisking/Repositories/breezy-adp-integration/ssl/adp-cert.key',
  callbackUrl: SSO.REDIRECT_URL,
}

function createConnection(conn) {
  return new Promise((resolve, reject) => {
    conn.connect((err) => {
      if (err) {
        console.error('AUTH-SERVICE Error Connecting to get client credentials', err)
        reject(err)
      } else {
        console.log('AUTH-SERVICE Connected!')
        resolve()
      }
    })

  })
}

function getAuthorizationRequest() {
  const conn = adpConnection.createConnection({ ...ssoConfigurationOpts });

  return conn.getAuthorizationRequest()
}

async function getUserAccessToken(authorizationCode) {
  const conn = adpConnection.createConnection({ ...ssoConfigurationOpts, authorizationCode });

  await createConnection(conn)

  return { accessToken: conn.accessToken }
}

async function getBreezyAccessToken() {
  const conn = adpConnection.createConnection({ ...connectorConfigurationOpts })

  await createConnection(conn)

  return { accessToken: conn.accessToken }
}

async function getBreezyTokenOnBehalfOfOrganization({ clientId, clientSecret }) {
  const conn = adpConnection.createConnection({
    ...connectorConfigurationOpts,
    clientId,
    clientSecret,
  })

  await createConnection(conn)

  return { accessToken: conn.accessToken }

}

module.exports = {
  getBreezyAccessToken,
  getBreezyTokenOnBehalfOfOrganization,
  getUserAccessToken,
  getAuthorizationRequest,
}