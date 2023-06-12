import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";



const CREATE_DELIVERY_MUTATION = `
mutation deliveryProfileCreate($profile: DeliveryProfileInput!) {
  deliveryProfileCreate(profile: $profile) {
    profile {
      id
      name
    }
    userErrors {
      field
      message
    }
  }
}
`


// `
// mutation deliveryProfileCreate {
//   deliveryProfileCreate(profile:{
//     name:"SAMPLE SHIPPING PROFILE"
//   }) {
//     profile {
//       id
//       name
//     }
//     userErrors {
//       field
//       message
//     }
//   }
// }
// `;

const UPDATE_DELIVERY_MUTATION = `
mutation ($profileId: ID!, $locationId: ID!) {
  deliveryProfileUpdate(
    id: $profileId
    profile: {
      locationGroupsToCreate: {
        locations: $locationId
        zonesToCreate: [
          {
            name: "Canada Shipping"
            countries: { code: "CA", includeAllProvinces: true }
            methodDefinitionsToCreate: {
              rateDefinition: { price: { amount: 100, currencyCode: "USD" } }
              name: "Shipping By App"
            }
          }
        ]
      }
    }
  ) {
    profile {
      id
      profileLocationGroups {
        locationGroupZones(first: 5) {
          edges {
            node {
              zone {
                id
                name
                countries {
                  id
                  name
                  provinces {
                    id
                    name
                    code
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

const GET_DELIVERY_PROFILE_QUERY=`query {
  deliveryProfiles (first: 5) {
    edges {
      node {
        id
        name
        profileItems (first:10)  {
          edges {
            node {
              product {
                id
                handle
              }
     
            }
          }
        }
        profileLocationGroups {
          id
          locationGroupZones(first: 2) {
            
            edges {

              node {
                id
                zone{
                  id
                  name
                }

                methodDefinitions(first: 2) {

                  edges {
                    node {
                      rateProvider {
                        ... on DeliveryRateDefinition {
                          id
                          price {
                            amount
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
}`;


const GET_LOCATIONS=`{
  locationsAvailableForDeliveryProfiles {
  id
  }
}
`

export const createDeliverProfile= async (session,profile) => {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    
  const deliverProfile=await client.query({
        data: {
          "query": CREATE_DELIVERY_MUTATION,
          "variables":{
            "profile":profile,
          }
        },
      });

      // console.log("Delivery Profile created is =>",deliverProfile);
      return deliverProfile;
      
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
          data:GET_DELIVERY_PROFILE_QUERY,
        });
  
        
        const myJSON = JSON.stringify(deliverProfile.body);
        // console.log("Delivery Profile List is =>",myJSON);
        return deliverProfile;
        
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

  export const updateDeliverProfile= async (session,deliverProfileId,profile) => {
  
    try {

      const client = new shopify.api.clients.Graphql({ session });
      console.log("Delivery Profile Id =>",deliverProfileId);
      console.log("Delivery Profile object is =>",profile);
      
    const deliverProfile=await client.query({
          data: {
            "query": UPDATE_DELIVERY_MUTATION,
            "variables": {
              "id": deliverProfileId,
              "profile":profile,
            }
          },
        });
  
        console.log("Delivery Profile Updated =>",deliverProfile.body.data.deliveryProfileUpdate);
       
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
  

  export const getLocations= async (session) => {
  
    try {

      const client = new shopify.api.clients.Graphql({ session });      
      const deliverProfileLocation=await client.query({
          data: {
            "query": GET_LOCATIONS,
          },
        });
  
        return deliverProfileLocation.body.data.locationsAvailableForDeliveryProfiles;
        console.log("GET Delivery Profile locations  =>",deliverProfileLocation.body.data.locationsAvailableForDeliveryProfiles);
       
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
  