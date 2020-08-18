const integrationEventModel = require('../models/integration_adp_event')

const EVENT_TYPES = {
  SUBSCRIPTION_ORDER: "SUBSCRIPTION_ORDER",
  USER_ASSIGNMENT: "USER_ASSIGNMENT",
  USER_UNASSIGNMENT: "USER_UNASSIGNMENT",
  SUBSCRIPTION_NOTICE: "SUBSCRIPTION_NOTICE",
  SUBSCRIPTION_CHANGE: "SUBSCRIPTION_CHANGE",
  SUBSCRIPTION_CANCEL: "SUBSCRIPTION_CANCEL",
}

//When to use error codes https://partnersupport.adp.com/hc/en-us/articles/360043134933
const ADP_EVENT_ERROR_CODES = {
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
  MAX_USERS_REACHED: "MAX_USERS_REACHED",
  UNAUTHORIZED: "UNAUTHORIZED",
  OPERATION_CANCELLED: "OPERATION_CANCELLED",
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",
  INVALID_RESPONSE: "INVALID_RESPONSE",
  PENDING: "PENDING",
  FORBIDDEN: "FORBIDDEN",
  BINDING_NOT_FOUND: "BINDING_NOT_FOUND",
  TRANSPORT_ERROR: "TRANSPORT_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}


function saveEvent(event) {
  return integrationEventModel.saveIntegrationEvent(event)
}

function getEvent(eventId) {
  return integrationEventModel.getIntegrationEvent(eventId)
}

module.exports = {
  getEvent,
  saveEvent,
  integrationEventTypes: EVENT_TYPES,
  errorCodes: ADP_EVENT_ERROR_CODES,
}