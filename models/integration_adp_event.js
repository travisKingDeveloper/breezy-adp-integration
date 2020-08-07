const mongo = require('breezy-core/src/db/mongoClient')()
const helpers = require('breezy-core/src/util/helpers')

const COLLECTION_NAME = 'integration_adp_event'

function saveIntegrationEvent(event) {
  event._id = helpers.getId()

  return mongo.putDocumentAsync({
    collection: COLLECTION_NAME,
    doc: event
  })
}

function getIntegrationEvent(_id) {
  return mongo.getDocumentAsync({
    collection: COLLECTION_NAME,
    criteria: { _id },
  })
}

module.exports = {
  saveIntegrationEvent,
  getIntegrationEvent,
}