const router = require('express').Router()

router.use('/status', require('./statusController'))

module.exports = router
