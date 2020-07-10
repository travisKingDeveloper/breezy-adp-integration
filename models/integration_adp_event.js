const mongo = require('breezy-core/src/db/mongoClient')()

const COLLECTION_NAME = 'integration_adp_event'

function saveIntegrationEvent(event) {
  return mongo.putDocumentAsync({
    collection: COLLECTION_NAME,
    doc: event
  })
}

module.exports = {
  saveIntegrationEvent,
}