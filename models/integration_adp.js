const mongo = require('breezy-core/src/db/mongoClient')()

async function getIntegration (serviceId, companyId) {
  try {
    let criteria = {
      "company_id": companyId,
      "type": serviceId
    };

    const integrations = await mongo.getDocumentAsync({
      collection: "integration",
      criteria: criteria
    })

    return integrations
  } catch (err) {
    console.error(`Unable to find integration for service id: ${serviceId} and company id: ${companyId}`)

    throw err
  }
}

module.exports = {
  getIntegrationNow: (companyId) => getIntegration('adp-now', companyId),
  getIntegrationRun: (companyId) => getIntegration('adp-run', companyId),
}
