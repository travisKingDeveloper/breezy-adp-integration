const request = require('request-promise-native')

const { COMPANY_SERVICE } = require('../config')

const baseUrl = `${COMPANY_SERVICE.URL}/api/v1`

async function getCompanyByFriendlyId(friendlyID) {
  try {
    const company = await request.get(`${baseUrl}/company`, {
      qs: { friendly_id: friendlyID },
      json: true,
    })

    return company
  } catch(err) {
    if (err.statusCode && err.statusCode === 404)
      return undefined

    throw err
  }
}

module.exports = {
  getCompanyByFriendlyId,
}