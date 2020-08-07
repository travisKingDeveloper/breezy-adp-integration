const integrationService = require('./integrationService')
const adpOrganizationService = require('./adpOrganizationService')

const root = '[REFRESH-SERVICE]'
async function refreshCompanyToken(companyId) {
  const { organization_id } = await integrationService.getIntegrationRun({ companyId })

  const response = await adpOrganizationService.getOrganizationCredentials(organization_id)

  if (!response || !response.events || !response.events.length || !response.events[0].data)  {
    return {
      success: false,
      message: `${root} Response not formatted right`,
      response,
    }
  }

  const {
    output: {
      consumerApplicationSubscriptionCredentials
    }
  } = response.events[0].data

  if (!consumerApplicationSubscriptionCredentials || !consumerApplicationSubscriptionCredentials.length) {
    return {
      success: false,
      message: `${root} Response not formatted right`,
      consumerApplicationSubscriptionCredentials,
    }
  }

  const [
    {
      subscriberOrganizationOID,
      clientID,
      clientSecret,
    }
  ] = consumerApplicationSubscriptionCredentials

  if(subscriberOrganizationOID !== organization_id) {
    return {
      success: false,
      message: `${root} organization ids do not match fetched ${subscriberOrganizationOID} !== ${organization_id}`
    }
  }

  console.log(root, `Successfully fetched the following (CLIENT ID)  ${clientID} and (CLIENT SECRET) ${clientSecret}`)

  await integrationService.createIntegrationRun({ companyId, client_id: clientID, client_secret: clientSecret })

  return {
    success: true,
  }
}

module.exports = {
  refreshCompanyToken
}