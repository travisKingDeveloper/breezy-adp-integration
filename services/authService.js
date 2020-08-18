const { ATS, OAUTH } = require('../config')
const adpConnectService = require('./adpConnectService')
const adpUserService = require('./adpUserService')
const integrationService = require('./integrationService')


function getRedirectUrl() {
  return adpConnectService.getAuthorizationRequest()
}

 async function interrogateClientCredentials(userCode, state) {
  const { accessToken } = await adpConnectService.getUserAccessToken(userCode)

  console.log('ACCESS TOKEN', accessToken)

   const userInfo =  await adpUserService.getUserInfo(accessToken)

   const organizationOid = userInfo.organizationOID

   const integration = await integrationService.getIntegrationRun({ organizationId: organizationOid })

  return getBreezyRedirectUrl(userInfo.email, integration.company_id)
}


function createAppConsentLink(successUri) {
  return `https://adpapps.adp.com/consent-manager/pending/direct?consumerApplicationID=${OAUTH.CONSUMER_APPLICATION_ID}&successUri=${successUri}`
}

function getBreezyRedirectUrl(userEmail, companyId) {
  return `${ATS.URL}/api/company/${companyId}/email/${userEmail}/adp/sso`
}

module.exports = {
  createAppConsentLink,
  getRedirectUrl,
  interrogateClientCredentials,
}