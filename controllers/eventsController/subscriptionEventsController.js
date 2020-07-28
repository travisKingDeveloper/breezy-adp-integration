const router = require('express').Router()

function sample(req, res) {
  console.log(`PATH: ${req.path}, QueryParams: ${JSON.stringify(req.query)}`)
  console.log(`EVENT: ${JSON.stringify(req.event)}`)
  res.status(200).send({ success: true, errorCode: undefined, message: "BooYah" })
  console.log('REQUEST: COMPLETE')
}

router.get('/create', sample)
router.get('/change', sample)
router.get('/cancel', sample)
router.get('/status', sample)


module.exports = router