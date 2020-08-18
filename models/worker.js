const exampleWorker = {
  firstName: 'Arin',
  lastName: 'Hanson',
  number: '904-504-6524',
  email: 'travis.king@breezyhr.com',
  positionType: 'fullTime', // fullTime, partTime, contractor, temporary
  workingHours: 40,
  gender: 'M'
}

const createWorkerRequest = (worker) => {
  const workerTypeCode = worker.positionType === 'contractor' ? 'Contractor': 'Employee'
  let workLevelCode
  switch(worker.positionType) {
    case "partTime":
      workLevelCode = "PartTime"
      break
    case "temporary":
      workLevelCode = "Temporary"
      break
    case "fullTime":
    case "contractor":
    default:
      workLevelCode = "FullTime"
  }

  const payload = {
    "events": [
      {
        "serviceCategoryCode": {
          "codeValue": "staffing"
        },
        "eventNameCode": {
          "codeValue": "applicant.onboard"
        },
        "data": {
          "eventContext": {},
          "transform": {
            "eventReasonCode": {
              "codeValue": "NH",
              "shortName": "New Hire"
            },
            "eventStatusCode": {
              "codeValue": "submit"
            },
            "applicant": {
              "person": {
                "genderCode": {
                  "codeValue": worker.gender || "F"
                },
                "legalName": {
                  "givenName": worker.firstName,
                  "familyName1": worker.lastName,
                },
                "legalAddress": {},
                "communication": {
                  "mobiles": [
                    {
                      "formattedNumber": worker.number,
                    }
                  ],
                  "emails": [
                    {
                      "emailUri": worker.email,
                      "nameCode": {
                        "codeValue": "personal"
                      }
                    },
                  ]
                },
              },
            },
            "jobOffer": {
              "offerTerms": {},
              "offerAssignment": {
                "workerTypeCode": {
                  "codeValue": workerTypeCode
                },
                "workLevelCode": {
                  "codeValue": workLevelCode
                },
                "standardHours": {
                  // Position Level Custom Field
                  "HoursQuantity": worker.workingHours || 40
                },
              }
            }
          }
        }
      }
    ]
  }

  return payload
}


module.exports = {
  createWorkerRequest,
  sampleRequest: createWorkerRequest(exampleWorker),
}
