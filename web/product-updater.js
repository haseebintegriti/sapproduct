import shopify from "./shopify.js";

export const product_updater= async ( session, varientsArray, productId)=>{
    let isOk = true;
    let response;
    const body = {
        product: {
            "variants": varientsArray
        }
    };
    // `session` is built as part of the OAuth process
    try {
        const client = new shopify.api.clients.Rest({ session });
        response = await client.put({
            path: `products/${productId}`,
            data: body,
        });
        // console.log("This Product is updated: ", response.body.product.variants)
    } catch (e) {
        isOk = false;
        console.log("error in api call", e);
    }

    return isOk;
    // console.log(response);
};