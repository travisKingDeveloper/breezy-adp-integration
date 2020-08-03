const express = require('express')
const router = express.Router()
const companyService = require('../../services/companyService')

const successResponse = {
  result:
  [
    {
      field:"friendly_company_id",
      title:"Valid Company ID",
      description:"The Company ID is valid!",
      level:"INFO"
    }
  ]
}
const errorResponse = {
  result:
    [
      {
        field:"friendly_company_id",
        title:"Invalid Company ID ",
        description:"You have entered an Invalid Company ID!",
        level:"ERROR"
      }
    ]
}

const root = "[ADP-VALIDATIONS]"
async function validateCreateADPCompany(req, res) {
  try {
    const { friendly_company_id } = req.body

    const company = await companyService.getCompanyByFriendlyId(friendly_company_id)

    if (!company) {
      console.error(root, "Company Not Found: Friendly ID ", friendly_company_id)

      return res.status(200).json(errorResponse)
    }

    return res.status(200).json(successResponse)
  } catch(err) {
    console.error(root, "Company Validation Failed err: ", err)

    return res.status(200).json(errorResponse)
  }
}

router.post('/create', validateCreateADPCompany)

module.exports = router


