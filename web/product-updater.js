import shopify from "./shopify.js";

export default async function product_updater(
    session,
    data
) {
    let functionCall = true;
    let response;
    const productId = data.id;
    const body = {
        product: {
            "variants": data.newVariantsArray
        }
    };
    // `session` is built as part of the OAuth process
    try {
        const client = new shopify.api.clients.Rest({ session });
        response = await client.put({
            path: `products/${productId}`,
            data: body,
        });
        console.log("This Product is updated: ", response.body.product.variants)
    } catch (e) {
        functionCall = false;
        console.log("error in api call", e);
    }

    // console.log(response);
    return response;
}