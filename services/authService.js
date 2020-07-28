const { SSO } = require('../config')
const adpConnection = require('adp-connection')

const connectionOpts = {
  clientId: SSO.CLIENT_ID,
  clientSecret: SSO.CLIENT_SECRET,
  granttype: 'authorization_code',
  sslCertPath: '../ssl/adp-cert.cer',
  sslKeyPath: '../ssl/adp-cert.crt',
  callbackUrl: SSO.REDIRECT_URL,
};
const conn = adpConnection.createConnection(connectionOpts);

function getRedirectUrl() {
  return conn.getAuthorizationRequest()
}


function getATSRedirectUrl() {
  return 'http://localhost:8080/'
}

module.exports = {
  getRedirectUrl,
  getATSRedirectUrl,
}