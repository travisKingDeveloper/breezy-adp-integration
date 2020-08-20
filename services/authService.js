const { ATS, OAUTH } = require('../config')
const accessManagementService = require('./accessManagementService')
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

  if (!userInfo || !userInfo.organizationOID || !userInfo.email) {
    return ATS.URL
  }

  const organizationOid = userInfo.organizationOID

  const companyIntegration = await integrationService.getIntegrationRun({ organizationId: organizationOid })

  if (!companyIntegration || !companyIntegration.company_id) {
    return ATS.URL
  }

  const userIntegration = await accessManagementService.getUserIntegration(userInfo.email, companyIntegration.company_id)

  if (!userIntegration || !userIntegration._id) {
    return ATS.URL
  }

  return getBreezyRedirectUrl(userInfo.email, companyIntegration.company_id)
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