const example = {
  "applicantOnboarding": {
    "applicantPersonalProfile": {
      "legalName": {
        "givenName": "Leigh",
        "middleName": "D",
        "familyName": "Avidan"
      },
      "preferredName": {
        "formattedName": "Dan"
      },
      "genderCode": {
        // TODO TKING M or F - Or Unspecified?
        "code": "M"
      },
      "birthDate": "1993-10-16",
      "governmentIDs": [
        {
          "id": "192-06-0427",
          "nameCode": {
            "code": "SSN"
          }
        }
      ],
      "communication": {
        "mobiles": [
          {
            "dialNumber": "2342357254"
          }
        ],
        "emails": [
          {
            "emailUri": "sgsg@sasf.com"
          }
        ]
      },
      "legalAddress": {
        "lineOne": "Address One",
        "lineTwo": "Address Two",
        "cityName": "City",
        "subdivisionCode": {
          "code": "NY"
        },
        "postalCode": "15601"
      },
      "formerNames": []
    },
    "applicantWorkerProfile": {
      "hireDate": "2020-03-16",
      "workerTypeCode": {
        "code": "Employee"
      },
      "workLevelCode": {
        "code": "FullTime"
      },
      "businessCommunication": {
        "landlines": [
          {
            "dialNumber": "2323423727",
            "extension": "346"
          }
        ],
        "emails": [
          {
            "emailUri": "user@example.com"
          }
        ]
      },
      "homeOrganizationalUnits": [
        {
          "nameCode": {
            //TODO TKING Appears to Be Client Specific
            "code": "02"
          }
        }
      ]
    },
    "applicantPayrollProfile": {
      "remunerationBasisCode": {
        "code": "H"
      },
      "baseRemuneration": {
        "hourlyRateAmount": {
          "amount": 15
        }
      },
      "payCycleCode": {
        "code": "M"
      },
      "standardPayPeriodHours": {
        "hoursQuantity": 170
      },
      "additionalRemunerations": [
        {
          "remunerationRate": {
            "rate": 12
          },
          "associatedRateQualifiers": [
            {
              "qualifierObjectCode": {
                //TODO TKING Appears to Be Client Specific
                "code": "02"
              }
            }
          ]
        },
        {
          "remunerationRate": {
            "rate": 10,
            "currencyCode": "USD"
          },
          "associatedRateQualifiers": [
            {
              "qualifierObjectCode": {
                //TODO TKING Appears to Be Client Specific
                "code": "03"
              }
            }
          ]
        }
      ],
      "customFieldGroup": {
        "indicatorFields": [
          {
            "nameCode": {
              "code": "Seasonal"
            },
            "indicatorValue": false
          }
        ]
      }
    },
    "applicantTaxProfile": {
      "usFederalTaxInstruction": {
        "federalIncomeTaxInstruction": {
          "taxWithholdingStatus": {
            "statusCode": {
              "code": "1"
            }
          },
          "taxFilingStatusCode": {
            "code": "H"
          },
          "taxAllowances": [
            {
              "allowanceTypeCode": {
                "code": "Dependents"
              },
              "taxAllowanceAmount": {
                "amount": 12
              }
            },
            {
              "allowanceTypeCode": {
                "code": "Deductions"
              },
              "taxAllowanceAmount": {
                "amount": 14
              }
            }
          ],
          "additionalIncomeAmount": {
            "amount": 20
          },
          "additionalTaxAmount": {
            "amount": 30
          }
        },
        "socialSecurityTaxInstruction": {
          "taxWithholdingStatus": {
            "statusCode": {
              "code": "1"
            }
          }
        },
        "medicareTaxInstruction": {
          "taxWithholdingStatus": {
            "statusCode": {
              "code": "1"
            }
          }
        },
        "federalUnemploymentTaxInstruction": {
          "taxWithholdingStatus": {
            "statusCode": {
              "code": "1"
            }
          }
        },
        "multipleJobIndicator": true,
        "statutoryWorkerIndicator": true,
        "qualifiedPensionPlanCoverageIndicator": true,
        "additionalStatutoryInputs": [
          {
            "tagCode": "version",
            "tagValues": [
              "2020"
            ]
          }
        ]
      },
      "usStateTaxInstructions": {
        "stateIncomeTaxInstructions": [
          {
            "taxWithholdingStatus": {
              "statusCode": {
                "code": "1"
              }
            },
            "taxFilingStatusCode": {
              "code": "NY1"
            },
            "taxAllowanceQuantity": 11,
            "overrideTaxAmount": {
              "amount": 4
            },
            "stateCode": {
              "code": "NY"
            },
            "livedInJurisdictionIndicator": true,
            "workedInJurisdictionIndicator": true
          }
        ],
        "suiTaxInstruction": {
          "stateCode": {
            "code": "NY"
          },
          "taxWithholdingStatus": {
            "statusCode": {
              "code": "1"
            }
          }
        }
      }
    }
  }
}

function createWorkerRequest(worker, meta) {

}


module.exports = {
  createWorkerRequest,
  sampleRequest: example,
}