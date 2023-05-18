import { productUpdateWebhook } from "./webhookvalidation.js";
import { DeliveryMethod } from "@shopify/shopify-api";
import shopify from "./shopify.js";


export default {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }
    },
  },
  PRODUCTS_UPDATE: {

    deliveryMethod: DeliveryMethod.Http,

    callbackUrl: "/api/webhooks",

    callback: async (topic, shop, body, webhookId) => {

      console.log('--- Product update ---');

      console.log('DeliveryMethod is', DeliveryMethod);

      const payload = JSON.parse(body);

      console.log(payload);

      console.log('--- /Product update ---');

    },
  },
  CARTS_UPDATE: {

    deliveryMethod: DeliveryMethod.Http,

    callbackUrl: "/api/webhooks",

    callback: async (topic, shop, body, webhookId, res) => {

      const payload = JSON.parse(body);
      let newVariantsArray = [];
      // const vid = 45109204975904;

      let prodID = payload.line_items.product_id;
      let object2;

      console.log('--- Cart Update ---');
      // console.log("Session is: ",res.locals.shopify.session);
      console.log('DeliveryMethod is', DeliveryMethod);
      // const xyz = await productUpdateWebhook(payload.line_items);

      

      // console.log(payload);

      // const cartProd = await shopify.api.rest.Product.find({
      //   session: res.locals.shopify.session,
      //   id: prodID,
      // });
      // console.log("Complete Product: ",cartProd);
      

      // console.log("Request from front end", req.body)
      // try {
      //   // console.log("getResponse :=>", JSON.stringify(getResponse.body));
      //   console.log("Price of product with ID: ", req.body.id, " is updated. Current price is: ", req.body.price, " Variants of product: ", req.body.variants);
      //   req.body.variants.map((item) => {
      //     if (item.id === vid) {
      //       object2 = {
      //         id: item.id,
      //         price: req.body.price
      //       }
      //     } else {
      //       object2 = {
      //         id: item.id
      //       }
      //     }
      //     newVariantsArray.push(object2);
      //   })
      //   req.body.newVariantsArray = newVariantsArray;
      //   const getResponse = await product_updater(res.locals.shopify.session, req.body);

      //   console.log("Array of variants ID: ", newVariantsArray);
      // } catch (e) {
      //   console.log(`Failed to process products/create: ${e.message}`);
      //   status = 500;
      //   error = e.message;
      // }

      console.log('--- /Cart Update ---');

    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
    },
  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
    },
  },
};
