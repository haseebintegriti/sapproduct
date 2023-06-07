import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";



const CREATE_DELIVERY_MUTATION = `
mutation {
    deliveryProfileCreate(
      profile: {
        sellingPlanGroupsToAssociate: ["gid://shopify/SellingPlanGroup/1"]
        name: "Deferred purchase options free shipping"
        locationGroupsToCreate: {
          locations: "gid://shopify/Location/1"
          zonesToCreate: {
            name: "All Countries"
            countries: { restOfWorld: true }
            methodDefinitionsToCreate: {
              rateDefinition: { price: { amount: 0, currencyCode: CAD } }
              name: "Test Shipping"
            }
          }
        }
      }
    ) {
      profile {
        id
        profileLocationGroups {
          locationGroupZones(first: 1) {
            edges {
              node {
                zone {
                  id
                  name
                  countries {
                    code {
                      restOfWorld
                    }
                  }
                }
                methodDefinitions(first: 1) {
                  edges {
                    node {
                      id
                      name
                      rateProvider {
                        __typename
                        ... on DeliveryRateDefinition {
                          price {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
`;

const GET_DELIVERY_MUTATION=`query {
    deliveryProfiles () {
      edges {
        node {
          id
          name
          default
        }
      }
    }
  }
  `

export const dilvery_change= async (session) => {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    
  const deliverProfile=await client.query({
        data: {
          query: CREATE_DELIVERY_MUTATION,
        //   variables: {
        //     input: {
        //       title: `${randomTitle()}`,
        //       variants: [{ price: randomPrice() }],
        //     },
        //   },
        },
      });

      console.log("Delivery Profile created is =>",deliverProfile)
      
  } catch (error) {
    if (error instanceof GraphqlQueryError) {

      console.log("Error in graph Sql")
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      console.log("Error in graph Sql")

      throw error;
    }
  }
}



export const deliverProfileGet= async (session)=>{
    const client = new shopify.api.clients.Graphql({ session });
  
    try {
      
    const deliverProfile=await client.query({
          data: `query {
            deliveryProfiles (first : 3) {
              edges {
                node {
                  id
                  name
                  default
                }
              }
            }
          }`
        });
  
        const myJSON = JSON.stringify(deliverProfile.body);
        console.log("Delivery Profile List is =>",myJSON);


        
    } catch (error) {
      if (error instanceof GraphqlQueryError) {
  
        console.log("Error in graph Sql")
        throw new Error(
          `${error.message}\n${JSON.stringify(error.response, null, 2)}`
        );
      } else {
        console.log("Error in graph Sql")
  
        throw error;
      }
    }
  }


