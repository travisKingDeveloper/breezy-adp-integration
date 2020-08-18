const router = require('express').Router()
const service = require('../services/candidateOnboardingService')

router.post('/company/:companyId/candidates', async (req, res, next) => {
  try {
    const { workers } = req.body
    const { companyId } = req.params

    if (!workers || !workers.length || !companyId) {
      return res.status(401).send({ msg: 'Invalid request'})
    }

    const response = await service.onboardWorkers(companyId, workers)

    return res.status(200).send(response)
  } catch (err) {
    next(err)
  }
})

router.get('/company/:companyId/meta', async (req, res, next) => {
  try {
    const { companyId } = req.params
    const response = await service.fetchMeta(companyId)

    res.status(200).send(response)

  } catch (err) {
    next(err)
  }
})

router.get('/sample', async (req, res) => {
  res.status(200).send(require('../models/worker').sampleRequest)
})

module.exports = router
