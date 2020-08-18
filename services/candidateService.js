const repository = require('../models/candidate')
const root = '[CANDIDATE_SERVICE]'

function getCandidates(companyId, candidateIds) {
  if (!Array.isArray(candidateIds)) {
    console.error(root, 'CandidateIds passed in', candidateIds, 'is not an array')
    throw new Error(`${root} Invalid Argument candidateIds ${candidateIds} is not an array`)
  }

  return repository.getCandidates(companyId, candidateIds)
}

function getCandidate(companyId, candidateId) {
  return getCandidates(companyId, [candidateId]).then(results => results[0])
}

module.exports = {
  getCandidate,
  getCandidates
}