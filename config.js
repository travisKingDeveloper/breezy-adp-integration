module.exports = {
  EVENTS_AUTH: {
    CONSUMER_KEY: 'BkMe5zDYDx',
    CONSUMER_SECRET: 'eabixPtxh5ibGrak9aUw',
  },
  COMPANY_SERVICE: {
    URL: 'http://localhost:8082'
  },
  ATS: {
    URL: 'http://localhost:8080'
  },
  SSO: {
    REDIRECT_URL: 'https://integrations-travis.ngrok.io/auth/sso/redirect',
    CLIENT_ID: '566c8257-7626-4326-9869-064e8912cb5b',
    CLIENT_SECRET: '2a21ce3c-d6e7-41a0-9a75-fb744752fa7e',
  },
  DATA_CONNECTOR: {
    CLIENT_ID: '36e4fedd-fb0b-472d-bf7c-101f195fbe96',
    CLIENT_SECRET: 'f8fd13a4-c2b5-4fa2-8aff-855fe70243a7',
  },
  CERTS: {
    CERT_PATH: '/Users/travisking/Repositories/breezy-adp-integration/ssl/adp-cert.cer',
    KEY_PATH: '/Users/travisking/Repositories/breezy-adp-integration/ssl/adp-cert.key',
  },

  Redis: {
    HOST: process.env.REDIS_HOST,
    PORT: 6379
  },
  Mongo: {
    connectionString:process.env.MONGO_CONNECTION_STRING
  },
  Mongo_EU: {
    connectionString:process.env.MONGO_EU_CONNECTION_STRING
  },
}