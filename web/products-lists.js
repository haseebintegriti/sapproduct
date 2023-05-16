import shopify from "./shopify.js";

export default async function product_lists(
    session
){
    let functionCall = true;
    let response;
    // `session` is built as part of the OAuth process
    try{
        response = await shopify.api.rest.Product.all({
            session: session,
            fields: "id,images,title,variants"
          });
        // console.log("List of Products from function: ",response);
    }catch(e){
        functionCall = false;
        console.log("error in api call",e);
    }
    
    // console.log(response);
    return response;
}