const router = require('express').Router()

function sample(req, res) {
  console.log(`PATH: ${req.path}, QueryParams: ${JSON.stringify(req.query)}`)
  console.log(`EVENT: ${JSON.stringify(req.event)}`)
  res.status(200).send({ success: true, errorCode: undefined, message: "BooYah" })
}

router.get('/user-assignment', sample)
router.get('/user-unassignment', sample)


module.exports = router