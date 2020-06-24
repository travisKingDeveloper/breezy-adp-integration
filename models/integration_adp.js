const mongo = require('breezy-core/src/db/mongoClient')()

async function getIntegration (serviceId, companyId) {
  let criteria = {
    "company_id": companyId,
    "type": serviceId
  };

  const integrations = await mongo.getDocumentAsync({
    collection: "integration",
    criteria: criteria
  })

  return integrations[serviceId]
}

module.exports = {
  getIntegration
}
