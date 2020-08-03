const router = require('express').Router()
const service = require('../services/authService')

const root = `[ADP-AUTH]`
function sample(req, res) {
  console.log(root, 'Hit me!')

  res.status(204).json({ ok: true })
}

async function initiateSSO(req, res) {
  console.log('req.path', req.path)
  console.log('req.query', req.query)


  res.redirect(service.getRedirectUrl())
}

async function redirectToPlatform(req, res, next) {
  try {
    console.log('req.path', req.path)
    console.log('req.query', req.query)
    // TODO TKING Verify State is correct

    if (req.query.error) {
      const { error, error_description } = req.query
      return res.status(500).json({ error, error_description })
    } else {
      const appRedirectUrl = await service.interrogateClientCredentials(req.query.code, req.query.state)

      return res.redirect(appRedirectUrl)
    }
  } catch(err) {
    console.error(root, 'ERROR Redirecting to ATS', err)
    next(err)
  }
}

router.all('/sso', initiateSSO)
router.all('/sso/redirect', redirectToPlatform)
router.all('/sso/logout', sample)

module.exports = router