// TODO TKING initialize Logging in app
const express = require('express')

const config = require('./config')
require('breezy-core/src/util/breezy-config').initConfig(config)

const app = express()
app.use(express.json())


app.use(function (req, res, next) {
  console.log(`[ADP_INTEGRATION] `, req.path, req.method)
  next()
})

app.use(require('./controllers'))

app.use(function(err, req, res, next) {
  console.error('[ADP_INTEGRATION] error ', err, req.path, req.method)

  res.status(500).send({ error: err })
})

const port = 8079
app.listen(port, function(err) {
  if (err) {
    console.error('Could not start application', err)
    process.exit(1)
  }

  console.log(`Listening on port ${port}`)
})
