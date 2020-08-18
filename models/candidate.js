const mongo = require('breezy-core/src/db/mongoClient')()

const COLLECTION_NAME = 'candidate'
const POSITION_COLLECTION_NAME = 'position'
const CANDIDATE_EEOC_NAME = 'candidate_eeoc'

async function getCandidates(company_id, candidate_ids) {
  const candidates = await mongo.getDocumentsAsync({
    collection: COLLECTION_NAME,
    criteria: {
      company_id,
      _id: {
        $in: candidate_ids
      }
    },
  })

  const positionIds = candidates.map(c => c.position_id).filter((value, index, self) => self.indexOf(value) === index)

  const positions = await mongo.getDocumentsAsync({
    collection: POSITION_COLLECTION_NAME,
    criteria: {
      company_id,
      _id: {
        $in: positionIds,
      }
    }
  })

  const positionDictionary = positions.reduce((prev, curr) => {
    prev[curr._id] = curr
    return prev
  }, {})

  const candidatesEEOC = await mongo.getDocumentsAsync({
    collection: CANDIDATE_EEOC_NAME,
    criteria: {
      company_id,
      candidate_id: {
        $in: candidate_ids,
      }
    }
  })

  const candidateEEOCDictionary = candidatesEEOC.reduce((prev, curr) => {
    prev[curr.candidate_id] = curr.eeoc
    return prev
  }, {})


  return candidates.map(candidate => ({
    ...candidate,
    eeoc: candidateEEOCDictionary[candidate._id],
    position: {
      ...positionDictionary[candidate.position_id]
    },
  }))
}

module.exports = {
  getCandidates
}
