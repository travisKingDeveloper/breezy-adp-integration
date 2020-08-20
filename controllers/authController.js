const router = require('express').Router()
const service = require('../services/authService')

const root = '[ADP-AUTH]'

async function initiateSSO(req, res) {
  console.log('req.path', req.path)
  console.log('req.query', req.query)

  res.redirect(service.getRedirectUrl())
}

async function redirectToPlatform(req, res, next) {
  try {
    console.log('req.path', req.path)
    console.log('req.query', req.query)

    if (req.query.error) {
      const { error, error_description } = req.query
      return res.status(500).json({ error, error_description })
    } else {
      const appRedirectUrl = await service.interrogateClientCredentials(req.query.code, req.query.state)

      return res.redirect(service.createAppConsentLink(appRedirectUrl))
    }
  } catch(err) {
    console.error(root, 'ERROR Redirecting to ATS', err)
    next(err)
  }
}



router.get('/sso', initiateSSO)
router.get('/sso/redirect', redirectToPlatform)

module.exports = router
