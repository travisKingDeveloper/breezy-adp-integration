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

async function replayCreateEvent(req, res, next) {
  try {
    const { replayId } = req.params
    await service.replayCreateSubscription(replayId)

    res.status(200)
  } catch (err) {
    console.error(root, 'ERROR Replaying event')
    next(err)
  }
}

async function fakeItTillYouMakeIt(req, res, next) {
  try {
    const organizationId = service.changeOrCreateSubscription()

  } catch (err) {
    next(err)
  }
}

router.get('/create/replay/:replayId', replayCreateEvent)
router.get('/create/fake', fakeItTillYouMakeIt)

router.use(validateOAuthSignature)
router.use(fetchEvent)

router.get('/create', changeOrCreateSubscription)
router.get('/change', changeOrCreateSubscription)
router.get('/cancel', sample)
router.get('/status', sample)

module.exports = router