const companyService = require('./companyService')
const integrationService = require('./integrationService')
const integrationEventService = require('./integrationEventService')

const root = '[SUBSCRIPTION-EVENT]'
async function changeOrCreateSubscription(payload) {
  try {
    const {
      organizationOID,
      friendly_company_id,
    } = payload.configuration

    const company = await companyService.getCompanyByFriendlyId(friendly_company_id)

    await integrationService.createIntegrationRun({ organizationId: organizationOID, companyId: company._id })

    console.log(root, 'Updating Integration with information that may not change')

    return { success: true }
  } catch (err) {
    console.error(root, 'Unable to change or create a subscription', err.message)

    return { success: false }
  }
}

// TODO TKING for testing purposes only
async function replayCreateSubscription(eventId) {
  const event = await integrationEventService.getEvent(eventId)

  return changeOrCreateSubscription(event.payload)
}



module.exports = {
  replayCreateSubscription,
  changeOrCreateSubscription
}