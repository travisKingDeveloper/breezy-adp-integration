const mongo = require('breezy-core/src/db/mongoClient')()
const request = require('request-promise-native')

const { COMPANY_SERVICE } = require('../config')

const baseUrl = `${COMPANY_SERVICE.URL}/api/v1`

const root = '[INTEGRATION-SERVICE]'
async function getIntegration (serviceId, { companyId, organizationId }) {
  try {
    let criteria = {
      "type": serviceId
    };

    if (companyId)
      criteria.company_id = companyId

    if (organizationId) {
      criteria[`${serviceId}.organization_id`] = organizationId
    }

    const doc = await mongo.getDocumentAsync({
      collection: "integration",
      criteria: criteria
    })

    return {
      ...doc,
      ...doc[serviceId],
      [serviceId]: undefined,
    }
  } catch (err) {
    console.error(root, `Unable to find integration for service id: ${serviceId} and company id: ${companyId}`)
    throw err
  }
}

async function upsertCompanyIntegration(serviceId, { companyId, organizationId }) {
  try {
    const response = await request.put(`${baseUrl}/company/${companyId}/integrations/${serviceId}/no-overwrite`, {
      qs: { acting_user_id: 'nimblebot' },
      body: {
        company_id: companyId,
        organization_id: organizationId,
      },
      json: true,
    })

    return response
  } catch(err) {
    console.error(root, 'An Error has occurred creating/updating the company integration')
    throw err
  }
}

const ADP_NOW = 'adp-now'
const ADP_RUN = 'adp-run'
module.exports = {
  getIntegrationNow: ({ companyId, organizationId }) => getIntegration(ADP_NOW, { companyId, organizationId }),
  getIntegrationRun: ({ companyId, organizationId }) => getIntegration(ADP_RUN, { companyId, organizationId }),
  createIntegrationNow: ({ companyId, organizationId }) => upsertCompanyIntegration(ADP_NOW, { companyId, organizationId }),
  createIntegrationRun: ({ companyId, organizationId }) => upsertCompanyIntegration(ADP_RUN, { companyId, organizationId }),
}
