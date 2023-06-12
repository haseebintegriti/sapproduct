import shopify from "./shopify.js";

export const product_updater= async ( session, varientsArray, productId)=>{
    let response={
        isOk:true,
        product:[]
    }
    const body = {
        product: {
            "variants": varientsArray
        }
    };
    // `session` is built as part of the OAuth process
    try {
        const client = new shopify.api.clients.Rest({ session });
      let  productUpdate = await client.put({
            path: `products/${productId}`,
            data: body,
        });

        response.product=productUpdate.body.product.variants;
        // console.log("This Product is updated: ", productUpdate.body.product.variants)
    } catch (e) {
        response.isOk = false;
        console.log("error in api call", e);
    }

    return response;
    // console.log(response);
};