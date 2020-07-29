const { SSO } = require('../config')
const adpConnection = require('adp-connection')

const connectionOpts = {
  clientId: SSO.CLIENT_ID,
  clientSecret: SSO.CLIENT_SECRET,
  granttype: 'authorization_code',
  sslCertPath: '/Users/travisking/Repositories/breezy-adp-integration/ssl/adp-cert.cer',
  sslKeyPath: '/Users/travisking/Repositories/breezy-adp-integration/ssl/adp-cert.crt',
  callbackUrl: SSO.REDIRECT_URL,
};


function getRedirectUrl() {
  const conn = adpConnection.createConnection({ ...connectionOpts });

  return conn.getAuthorizationRequest()
}


async function getClientCredentialsRedirectUrl(userCode, state) {
  const conn = adpConnection.createConnection({ ...connectionOpts, authorizationCode: userCode });

  await createConnection(conn)

  console.log('ACCESS TOKEN', conn.accessToken)

  return 'http://localhost:8080/'
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

module.exports = {
  getRedirectUrl,
  getClientCredentialsRedirectUrl,
}