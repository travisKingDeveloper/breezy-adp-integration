const router = require('express').Router()
const { errorCodes } = require('../../services/integrationEventService')

const subscriptionEventController = require('./subscriptionEventsController')
const accessManagementController = require('./accessManagementController')
const validationController = require('./validationController')

router.use('/subscription', subscriptionEventController)
router.use('/accessManagement', accessManagementController)
router.use('/validation', validationController)

router.use((err, req, res, next) => {
  const error = errorCodes[err.code] || errorCodes.UNKNOWN_ERROR

  console.error('INTEGRATION EVENT ERROR', error, err.message)

  res.status(200).send({
    success: "false",
    errorCode: error,
    message: error.response || 'An Error Has Occurred'
  })
})

module.exports = router