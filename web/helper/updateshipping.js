import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";



export const UpdateeShipping = async (dpId, lgId, lgzId,session) => {
    const client = new shopify.api.clients.Graphql({ session });
  
    try {
      const updateShiiping = await client.query({
        data: {
          query: `mutation {
            deliveryProfileUpdate(
              id: "${dpId}",
              profile: {
                locationGroupsToUpdate: [{
                  id: "${lgId}",
                  zonesToUpdate: [{
                    id: "${lgzId}",
                    name: "Domestic",
                    countries: [{
                      code: CA
                      provinces: [
                        { code: "AB" },
                      ]
                    }],
                    "methodDefinitionsToUpdate": [
                      {
                        "description": "test shipping by app",
                        "id": "",
                        "name": "SAP APP SHIPPING",
                        "priceConditionsToCreate": [
                          {
                            "criteria": {
                              "amount": "100",
                              "currencyCode": "USD"
                            },
                            "operator": "LESS_THAN_OR_EQUAL_TO"
                          }
                        ],
                        "rateDefinition": {
                          "price": {
                            "amount": "5",
                            "currencyCode": "USD"
                          }
                        },
                      }
                    ],
                  }]
                }]
              }
            ) {
              profile {
                id
              }
              userErrors {
                field
                message
              }
            }
          }`,
        }
      });
  
      // console.log("Delivery Profile created is =>", deliverProfile);
      return updateShiiping;
    } catch (error) {


      if (error instanceof GraphqlQueryError) {
        console.log("Error in GraphQL and error is :=>",error)
        throw new Error(`${error.message}\n${JSON.stringify(error.response, null, 2)}`);
      } else {
        console.log("Error in GraphQL");
        throw error;
      }
    }
  }
  