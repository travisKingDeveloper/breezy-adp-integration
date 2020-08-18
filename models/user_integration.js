const mongo = require('breezy-core/src/db/mongoClient')()

const COLLECTION_NAME = 'user_adp_integration'

function getUserIntegration(userId, companyId, criteria = {}) {
  return mongo.getDocumentAsync({
    collection: COLLECTION_NAME,
    criteria: {
      archived: false,
      ...criteria,
      user_id: userId,
      company_id: companyId,
    },
  })
}

function createUserIntegration(doc) {
  return mongo.putDocumentAsync({
    collection: COLLECTION_NAME,
    doc,
  })
}

function archiveUserIntegration(userId, companyId, archived = true) {
  return updateUserIntegration(userId, companyId, { archived })
}

function updateUserIntegration(userId, companyId, updates) {
  return mongo.findAndModifyAsync({
    collection: COLLECTION_NAME,
    criteria: {
      user_id: userId,
      company_id: companyId,
    },
    updates
  })
}

module.exports = {
  archiveUserIntegration,
  getUserIntegration,
  createUserIntegration,
  updateUserIntegration,
}

