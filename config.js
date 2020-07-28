module.exports = {
  EVENTS_AUTH: {
    CONSUMER_KEY: 'BkMe5zDYDx',
    CONSUMER_SECRET: 'eabixPtxh5ibGrak9aUw',
  },
  COMPANY_SERVICE: {
    URL: 'http://localhost:8082'

  },
  SSO: {
    REDIRECT_URL: 'https://integrations-travis.ngrok.io/auth/sso/redirect',
    CLIENT_ID: '566c8257-7626-4326-9869-064e8912cb5b',
    CLIENT_SECRET: '2a21ce3c-d6e7-41a0-9a75-fb744752fa7e',
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