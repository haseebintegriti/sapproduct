import { DeliveryMethod } from "@shopify/shopify-api";
import shopify from "./shopify.js";
import {updateProduct, getCheckout} from "./helper/price-change-helper.js";
// import app from './index.js';

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
  CHECKOUTS_CREATE: {

    deliveryMethod: DeliveryMethod.Http,

    callbackUrl: "/api/webhooks",

    callback: async (topic, shop, body, webhookId) => {

      console.log('--- Checkout create ---');

      console.log('DeliveryMethod is', DeliveryMethod);

      const payload = JSON.parse(body);
            //  console.log(payload);


      // console.log("Shop :",shop);
      // console.log("Token :",payload.cart_token);


      const response = await getCheckout(shop,payload.token,payload.cart_token,payload.email,payload);


      // Session is built by the OAuth process

      // console.log(payload);

      console.log('--- /Checkouts create ---');

    },
  },
  // CARTS_UPDATE: {

  //   deliveryMethod: DeliveryMethod.Http,

  //   callbackUrl: "/api/webhooks",

  //   callback: async (topic, shop, body, webhookId) => {

  //     const payload = JSON.parse(body);


  //     console.log('--- Cart Update ---');
  //     // console.log("Session is: ",res.locals.shopify.session);
  //     console.log('DeliveryMethod is', DeliveryMethod);
  //   try {
  //       // console.log('shop name :',req);
  //       // console.log('varients :',res);
  //     // console.log("Shop is here :",shop);
  //     // req.shopName=shop;
  //     // req.varients=payload.line_items;
 
  //     const response = await updateProduct(shop,payload.line_items);
  //     console.log("Product update response.",response)
  //     // if(response){
  //     //   app._router.handle({ method: 'GET', url: '/refresh' }, {}, () => {});
  //     // }
      
  //   } catch (error) {
  //     console.log("Error in assigning values",error)
  //   }
    
  //     // console.log("Response from productUpdate fruntion =>",response);
      
  //     console.log('--- /Cart Update ---');

  //   },
  // },

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


