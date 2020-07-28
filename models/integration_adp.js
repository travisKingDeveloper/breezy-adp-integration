const mongo = require('breezy-core/src/db/mongoClient')()

function getIntegration (serviceId, { companyId, organizationId }) {
  try {
    let criteria = {
      "type": serviceId
    };

    if (companyId)
      criteria.company_id = companyId

    if (organizationId)
      criteria.organization_id = organizationId

    return mongo.getDocumentAsync({
      collection: "integration",
      criteria: criteria
    })
  } catch (err) {
    console.error(`Unable to find integration for service id: ${serviceId} and company id: ${companyId}`)
    throw err
  }
}

module.exports = {
  getIntegrationNow: ({ companyId, organizationId }) => getIntegration('adp-now', { companyId, organizationId }),
  getIntegrationRun: ({ companyId, organizationId }) => getIntegration('adp-run', { companyId, organizationId }),
}
