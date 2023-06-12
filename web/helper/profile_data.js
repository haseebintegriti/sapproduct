export const deliverProfileVaribles= {
    "profile": {
      "locationGroupsToCreate": [
        {
            "locations": [
                ""
              ],
              "locationsToAdd": [
                ""
              ],
            "zonesToCreate": [
            {
              "countries": [
                {
                  "code": "CA",
                  "includeAllProvinces": true,
                  "provinces": [
                    {
                      "code": ""
                    }
                  ],
                  "restOfWorld": true
                }
              ],
            //   "id": "",
              "methodDefinitionsToCreate": [
                {
                  "active": true,
                //   "conditionsToUpdate": [
                //     {
                //       "criteria": 1.1,
                //       "criteriaUnit": "kg",
                //       "field": "TOTAL_WEIGHT",
                //       "id": "condition-1",
                //       "operator": "GREATER_THAN_OR_EQUAL_TO"
                //     }
                //   ],
                  "description": "Sample method definition",
                //   "id": "",
                  "name": "Standard Shipping",
                //   "participant": {
                //     "adaptToNewServices": true,
                //     "carrierServiceId": "",
                //     "fixedFee": {
                //       "amount": "",
                //       "currencyCode": ""
                //     },
                //     // "id": "",
                //     "participantServices": [
                //       {
                //         "active": true,
                //         "name": ""
                //       }
                //     ],
                //     "percentageOfRateFee": 1.1
                //   },
                  "priceConditionsToCreate": [
                    {
                      "criteria": {
                        "amount": "50.0",
                        "currencyCode": "USD"
                      },
                      "operator": "GREATER_THAN_OR_EQUAL_TO"
                    }
                  ],
                  "rateDefinition": {
                    // "id": "",
                    "price": {
                      "amount": "10.0",
                      "currencyCode": "USD"
                    }
                  },
                  "weightConditionsToCreate": [
                    {
                      "criteria": {
                        "unit": "KILOGRAMS",
                        "value": 1.1
                      },
                      "operator": "GREATER_THAN_OR_EQUAL_TO"
                    }
                  ]
                }
              ],
              "name": "Sample Zone"
            }
          ], 
        }
      ],
      "name": "NEW TEST SAMPLE SHIPPING",
    }
  }
  