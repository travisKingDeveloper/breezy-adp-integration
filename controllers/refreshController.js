const router = require('express').Router()
const service = require('../services/refreshService')

router.post('/company/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params

    const response = await service.refreshCompanyToken(companyId)

    return res.status(200).json(response)
  } catch(err) {
    next(err)
  }
})

module.exports = router
