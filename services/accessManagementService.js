const integrationService = require('./integrationService')
const userIntegrationModel = require('../models/user_integration')
const userService = require('./userService')

async function processAssignedEvent(eventPayload) {
  const {
    user: {
      uuid: primarySourceId,
      openId, //URL To get more information about the user
      email,
      firstName,
      lastName,
      attributes: {
        appAdmin, //Field that determines that user is going to be admin in this app
      }
    },
    configuration: {
      organizationOID,
    }
  } = eventPayload

  const integration = await integrationService.getIntegrationRun({ organizationId: organizationOID })
  const companyId = integration.company_id

  let user = await userService.getUserByEmail(email)

  if (!user) {
    // TODO TKING Investigate fields
    //  Missing fields tz_offset
    //  How to make admin? admin = true === appAdmin
    user = await userService.createUser(companyId, {
      email,
      name: `${firstName} ${lastName}`,
      emailVerified: true, //Setting to True because this is an SSO user
      sso: true,
    })

    await userService.addUserToCompany(companyId, user._id)

    if (appAdmin !== "false") {
      await userService.addAdminToCompany(companyId, user._id)
    }
  }

  let userIntegration = await userIntegrationModel.getUserIntegration(user._id, companyId)

  if (!userIntegration) {
    await userIntegrationModel.createUserIntegration({
      user_id: user._id,
      company_id: companyId,
      tokens: {},
    })
  } else if (userIntegration && userIntegration.archived) {
    await userIntegrationModel.archiveUserIntegration(user._id, companyId, false)
  }

  return {
    success: true
  }
}

async function processUnassignedEvent(eventPayload) {
  const {
    user: {
      email,
    },
    configuration: {
      organizationOID,
    }
  } = eventPayload

  const integration = await integrationService.getIntegrationRun({ organizationId: organizationOID })
  const companyId = integration.company_id

  let user = await userService.getUserByEmail(email)

  if (!user || user && !user._id) {
    // throw new Error('[ACCESS-MANAGEMENT] Cannot Unassign user that does not exist')
    return
  }

  return userIntegrationModel.archiveUserIntegration(user._id, companyId)
}

module.exports = {
  processAssignedEvent,
  processUnassignedEvent,
}
