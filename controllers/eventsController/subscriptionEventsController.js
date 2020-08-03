const router = require('express').Router()
const service = require('../../services/subscriptionEventsService')

const { validateOAuthSignature, fetchEvent } = require('./authThunks')

const root = '[SUBSCRIPTION-EVENTS-CONTROLLER]'
function sample(req, res) {
  console.log(root, `PATH: ${req.path}, QueryParams: ${JSON.stringify(req.query)}`)
  console.log(root, `EVENT: ${JSON.stringify(req.event)}`)
  res.status(200).send({ success: true, errorCode: undefined, message: "BooYah" })
  console.log(root, 'REQUEST: COMPLETE')
}

async function changeOrCreateSubscription(req, res) {
  console.log(root, `PATH: ${req.path}, QueryParams: ${JSON.stringify(req.query)}`)
  console.log(root, `EVENT: ${JSON.stringify(req.event)}`)
  const response = await service.changeOrCreateSubscription(req.event.payload)

  res.status(200).send({ success: response.success, errorCode: response.errorCode, message: response.message })
  console.log(root, 'REQUEST: COMPLETE')
}

router.use(validateOAuthSignature)
router.use(fetchEvent)
router.get('/create', changeOrCreateSubscription)
router.get('/change', changeOrCreateSubscription)
router.get('/cancel', sample)
router.get('/status', sample)

module.exports = router