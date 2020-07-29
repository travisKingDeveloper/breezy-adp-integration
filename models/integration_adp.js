const mongo = require('breezy-core/src/db/mongoClient')()

async function getIntegration (serviceId, { companyId, organizationId }) {
  try {
    let criteria = {
      "type": serviceId
    };

    if (companyId)
      criteria.company_id = companyId

    if (organizationId) {
      criteria[serviceId] = {}
      criteria[serviceId].organization_id = organizationId
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
    console.error(`Unable to find integration for service id: ${serviceId} and company id: ${companyId}`)
    throw err
  }
}

module.exports = {
  getIntegrationNow: ({ companyId, organizationId }) => getIntegration('adp-now', { companyId, organizationId }),
  getIntegrationRun: ({ companyId, organizationId }) => getIntegration('adp-run', { companyId, organizationId }),
}
