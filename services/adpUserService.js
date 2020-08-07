const request = require('request-promise-native')
const fs = require('fs')

const { CERTS } = require('../config')
const root = '[ADP-USER-SERVICE]'
const url = 'https://api.adp.com/core/v1/userinfo'

async function getUserInfo(accessToken) {
  try {
    const organizationCredentials = await request.get(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        roleCode: 'administrator'
      },
      key: fs.readFileSync(CERTS.KEY_PATH),
      cert: fs.readFileSync(CERTS.CERT_PATH),
      json: true,
    })

    return organizationCredentials
  } catch(err) {
    console.error(root, 'ERROR Fetching user info', err)
    throw err
  }
}

module.exports = {
  getUserInfo,
}