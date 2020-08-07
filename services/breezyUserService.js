const request = require('request-promise-native')

const { COMPANY_SERVICE } = require('../config')

const baseUrl = `${COMPANY_SERVICE.URL}/api/v1`

async function getUserByEmail(email) {
  try {
    const user = await request.get(`${baseUrl}/user/email`, {
      qs: { email_address: email },
      json: true,
    })

    return user
  } catch(err) {
    if (err.statusCode && err.statusCode === 404)
      return undefined

    throw err
  }
}

function createUser(companyId, { email, name }) {
  const userData = {
    email,
    name,
    emailVerified: true, //Setting to True because this is an SSO user
    sso: true,
  }

  return request.post(`${baseUrl}/user`, {
    body: userData,
    json: true,
  })
}

function addUserToCompany(companyId, userId) {
  return request.post(`${baseUrl}/company/${companyId}/member`, {
    qs: { acting_user_id: 'nimblebot' },
    body: {
      member: {
        _id: userId
      }
    },
    json: true,
  })

}

function addAdminToCompany(companyId, userId) {
  return request.put(`${baseUrl}/company/${companyId}/admins/${userId}`, {
    qs: { acting_user_id: 'nimblebot' }
  })
}

module.exports = {
  addAdminToCompany,
  addUserToCompany,
  createUser,
  getUserByEmail,
}