const router = require('express').Router()
const service = require('../../services/accessManagementService')

async function userAssignment(req, res, next) {
  try {
    console.log(`PATH: ${req.path}, QueryParams: ${JSON.stringify(req.query)}`)
    console.log(`EVENT: ${JSON.stringify(req.event)}`)

    const response = await service.processAssignedEvent(req.event.payload)

    res.status(200).send({ success: true, errorCode: undefined, message: "BooYah" })
  } catch(err) {
    console.error('[ACCESS-MANAGEMENT] User Assignment Error', err)
    next(err)

  }
}

async function userUnassignment(req, res, next) {
  try {
    console.log(`PATH: ${req.path}, QueryParams: ${JSON.stringify(req.query)}`)
    console.log(`EVENT: ${JSON.stringify(req.event)}`)

    const response = await service.processUnassignedEvent(req.event.payload)

    res.status(200).send({ success: true, errorCode: undefined, message: "BooYah" })
  } catch(err) {
    console.error('[ACCESS-MANAGEMENT] User Unassigned Error', err)
    next(err)
  }
}

router.get('/user-assignment', userAssignment)
router.get('/user-unassignment', userUnassignment)

module.exports = router