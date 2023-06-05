// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import {product_updater} from "./product-updater.js";
import product_lists from "./products-lists.js"
import webhookHandlers from "./webhook-handlers.js";
import ShopifyToken from "shopify-token/index.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import { verify } from "./webhookvalidation.js";
// import {productGet} from "./product-price-changer.js";
import {getSessionFromDB,getSession} from "./helper/price-change-helper.js";




const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
let query;
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;


const app = express();
   
const bodyParserPrewiring = (app) => {
  // save a raw (unprocessed) version of 'body' to 'rawBody'
  function parseVerify(req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8')
    }
  }

  app.use(bodyParser.json({
    verify: parseVerify,
    limit: '10mb'
  }));

  app.use(bodyParser.urlencoded({
    extended: true,
    verify: parseVerify,
    limit: '10mb'
  }));
}
// const app = express();
bodyParserPrewiring(app)

// app.use(cors());

app.get(shopify.config.auth.path, shopify.auth.begin());

app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

app.post(shopify.config.webhooks.path, async(req, res, next) =>{


  req.body = req.rawBody;
  // req.body=res;

  next(); // go on to the real webhook handler

  // const hmacHeader = req.get('X-Shopify-Hmac-Sha256')
  // const data = req.rawBody
  // const verified = await verify(
  //   hmacHeader,
  //   data // takes the raw body extracted before bodyparsing
  // );
  // if (verified) {
  //   next(); // go on to the real webhook handler
  //   console.log("Cart updated!");
  // } else {
  //   console.log("Webhook is not valid!");
  // }

});

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers })
);


// app.get('/refresh', (req, res) => {
//   res.send();
// });
app.post("/api/webhook/cartupdate", async (req, res) => {
  let status = 200;
  let error = null;
  try {
   
  console.log("Cart update  called");
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.post('/api/cart/update', async (req, _res) => {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256')

  const data = req.rawBody

  const verified = await verify(
    hmacHeader,
    data // takes the raw body extracted before bodyparsing
  );
  if (verified) {
    console.log("Cart updated!");
  } else {
    console.log("Webhook is not valid!");
  }

});

app.get("/api/products/count", async (_req, res) => {
  try {
    const countData = await shopify.api.rest.Product.count({
      session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
    console.log("Count data is: ", countData);
  } catch (error) {
    console.log("Error in  count products and error is :",error)
  }
  
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/product/pricechange", async (req, res) => {
  let status = 200;
  let error = null;

  try {

  // const getResponse=  await product_updater(res.locals.shopify.session, req.body);

  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
    // res.status(status).send({ success:"Api call success" });
});

// Updating product price. 
app.get("/api/products/update", async (_req, res) => {

  console.log("backend Product Update Call.");
  let status = 200;
  let error = null;

  try {
    const updatedProduct = await product_updater(res.locals.shopify.session);
    console.log("Updated Product Info",updatedProduct);
  } catch (e) {
    console.log(`Failed to process products/update: ${e.message}`);
    status = 500;
    error = e.message;
  }

  res.status(status).send({ success: status === 200, error });
});

// Getting list of products.
app.get("/api/products/list", async (_req, res) => {
  let status = 200;
  let error = null;
  let listProducts;
  try {
    listProducts = await product_lists(res.locals.shopify.session);
    console.log("List of products: ", listProducts);
  } catch (e) {
    console.log(`Failed to process products/update: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.json(listProducts);
});

app.post('/carrier-service-callback', (req, res) => {
  console.log("Console req from carrier-service-callback",req);
  console.log("Console res from carrier-service-callback",res);

});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT, () => {

  console.log(`App listening on port ${PORT}`)

});



