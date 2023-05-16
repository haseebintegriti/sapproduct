// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import product_updater from "./product-updater.js";
import product_lists from "./products-lists.js"
import webhookHandlers from "./webhook-handlers.js";
import ShopifyToken from "shopify-token/index.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import { verify } from "./webhookvalidation.js";


const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
let query;
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// shopifyToken
//   .getAccessToken(hostname, code)
//   .then((data) => {
//     console.log(data);
//     // => { access_token: 'f85632530bf277ec9ac6f649fc327f17', scope: 'read_content' }
//   })
//   .catch((err) => console.warn(err));
// const secretKey = '<your secret key here>';
// Set up Shopify authentication and webhook handling

app.get(shopify.config.auth.path, shopify.auth.begin());

app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res) => {
    query = req.query;
    console.log("Query Data of app...", query)
  },
  shopify.redirectToShopifyOrAppRoot()
);



app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers:webhookHandlers })
);


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


app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  console.log("ENV variables => ",process.env);
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  console.log("Count data is: ", countData);
  res.status(200).send(countData);
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

// Updating product title and price. 
app.get("/api/products/update", async (_req, res) => {
  

  // let status = 200;
  // let error = null;

  // try {
  //   const updatedProduct = await product_updater(res.locals.shopify.session);
  // } catch (e) {
  //   console.log(`Failed to process products/update: ${e.message}`);
  //   status = 500;
  //   error = e.message;
  // }
  // res.status(status).send({ success: status === 200, error });

  console.log("Request from Frontend.",_req);
  res.status(200);
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

