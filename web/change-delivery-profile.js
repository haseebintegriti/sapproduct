import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";



const CREATE_DELIVERY_MUTATION = `
mutation deliveryProfileCreate {
  deliveryProfileCreate(profile:{
    name:"SAMPLE SHIPPING PROFILE"
  }) {
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
            deliveryProfiles (first : 5) {
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


