module.exports = {
  AUTH: {
    CONSUMER_KEY: 'BkMe5zDYDx',
    CONSUMER_SECRET: 'eabixPtxh5ibGrak9aUw',
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