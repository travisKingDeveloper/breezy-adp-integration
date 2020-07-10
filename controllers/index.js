const router = require('express').Router()

router.use('/status', require('./statusController'))
router.use('/events', require('./eventsController'))
router.use('/auth', require('./authController'))

module.exports = router
