const router = require('express').Router()

router.use('/status', require('./statusController'))
router.use('/events', require('./eventsController'))
router.use('/auth', require('./authController'))
router.use('/refresh', require('./refreshController'))
router.use('/onboarding', require('./candidateOnboardingController'))

module.exports = router
