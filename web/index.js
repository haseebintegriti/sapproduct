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
import { verify, productUpdateWebhook } from "./webhookvalidation.js";
import {productGet} from "./product-price-changer.js";
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

app.post(shopify.config.webhooks.path, function(req, res, next) {
  req.body = req.rawBody
  next(); // go on to the real webhook handler
});

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers })
);



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

app.post("/api/product/pricechange", async (req, res) => {
  let status = 200;
  let error = null;
  let newVariantsArray =[];
  const vid = 45109204975904;
  let object2;

console.log("Request from front end", req.body);
  try {
    const xyz = await productUpdateWebhook(req.body);
    console.log("XYZ: ",xyz);
  // console.log("getResponse :=>", JSON.stringify(getResponse.body));
  // const getResponse=  await productGet(res.locals.shopify.session,req.body.name);

  console.log("Price of product with ID: ",req.body.id, " is updated. Current price is: ",req.body.price, " Variants of product: ", req.body.variants );
  req.body.variants.map((item)=>{
    if(item.id === vid){
      object2 = {
        id:item.id,
        price:req.body.price
      }
    }else{
      object2 = {
        id:item.id
      }
    }
    newVariantsArray.push(object2);
  })
  req.body.newVariantsArray = newVariantsArray;
  const getResponse=  await product_updater(res.locals.shopify.session, req.body);

  console.log("Array of variants ID: ",newVariantsArray);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
    // res.status(status).send({ success:"Api call success" });

});


app.post("/api/product/pricechangebyname", async (req, res) => {

  let status = 200;
  let error = null;

  console.log("Api called from backend")

  try {
    const shopName="integriti-group-inc-test.myshopify.com";
    const response=await getSession(shopName);
    console.log("response from getSession function :=>", response );
    console.log("Request from front end", req.body);
  } catch (e) {
     console.log("Error in back end aoi cal:=>",e)
    status = 500;
    error = e.message;
  }

  res.status(status).send({ success: status === 200, error });
})
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

