export const deliverProfileVaribles= {
    "profile": {
      "locationGroupsToCreate": [
        {
            // "id":"",
            "locations":[],
            "zonesToCreate": [
            {
              "countries": [
                {
                  "code": "CA",
                  "includeAllProvinces": true,
                  // "provinces": [
                  //   {
                  //     "code": ""
                  //   }
                  // ],
                  "restOfWorld": false
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
                  "name": "Standard Shipping",
              
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
                  // "weightConditionsToCreate": [
                  //   {
                  //     "criteria": {
                  //       "unit": "KILOGRAMS",
                  //       "value": 5
                  //     },
                  //     "operator": "GREATER_THAN_OR_EQUAL_TO"
                  //   }
                  // ]
                }
              ],
              "name": "Domestic"
            }
          ], 
        }
      ],
      "name": "NEW SAP SHIPPING",
      "variantsToAssociate": [],
    }
  }
  

  export const updateDP= {
    "profile": {
      "locationGroupsToUpdate": [
        { 
          "id":"",
          "zonesToUpdate": [
            {   
              "id": "",           
              "methodDefinitionsToUpdate": [
                {
                  "id": "",
                  "rateDefinition": {
                    "id": "",
                    "price": {
                      "amount": 10,
                      "currencyCode": 'USD'
                    }
                  },
                }
              ],
            }
          ]
        }
      ]
    }
  }


   // "conditionsToUpdate": [
                  //   {
                  //     "criteria": 1.1,
                  //     "criteriaUnit": "",
                  //     "field": "",
                  //     "id": "",
                  //     "operator": ""
                  //   }
                  // ],
  