import shopify from "./shopify.js";

export default async function product_updater(
    session
){
    let functionCall = true;
    let response;
    const productId = 8247135404320;
    const body = {
      product: {
        title: "Apple Air MacBook M1 Pro",
        "variants": [
          {
          "price":"1599.99",
          "inventory_quantity": 3
          }
      ]
      }
    };
    // `session` is built as part of the OAuth process
    try{
        const client = new shopify.api.clients.Rest({ session });
        response = await client.put({
        path: `products/${productId}`,
        data: body,
        });
        console.log("This Product is updated: ",response.body.product.variants)
    }catch(e){
        functionCall = false;
        console.log("error in api call",e);
    }
    
    // console.log(response);
    return response;
}