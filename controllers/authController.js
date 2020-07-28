const router = require('express').Router()
const authService = require('../services/authService')


const root = `[ADP-AUTH]`
function sample(req, res) {
  console.log(root, 'Hit me!')

  res.status(204).json({ ok: true })
}

async function initiateSSO(req, res) {
  console.log('req.path', req.path)
  console.log('req.query', req.query)


  res.redirect(authService.getRedirectUrl())
}

function redirectToPlatform(req, res) {
  console.log('req.path', req.path)
  console.log('req.query', req.query)
  if (req.query.error) {
    const { error, error_description } = req.query
    res.status(500).json({ error, error_description })
  } else {
    res.redirect(authService.getATSRedirectUrl())
  }
}

router.all('/sso', initiateSSO)
router.all('/sso/redirect', redirectToPlatform)
router.all('/sso/logout', sample)

module.exports = router