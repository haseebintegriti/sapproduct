import shopify from "../shopify.js";
import { PriceChangeDB } from "../price-change-db.js";
import { product_updater } from '../product-updater.js';
import { deliverProfileVaribles, updateDP } from "./profile_data.js"
import { createDeliverProfile, deliverProfileGet, updateDeliverProfile, getLocations } from "../change-delivery-profile.js";
import { taxchange, updateCountryTax } from "./taxchange.js"
import fetch from 'node-fetch';
import xml from 'xmlbuilder';
import 'dotenv/config'
import {UpdateeShipping} from "./updateshipping.js"

export async function getShopUrlFromSession(req, res) {
  return `https://${res.locals.shopify.session.shop}`;
}

export const getSessionFromDB = async (shopName) => {

  console.log("req inside the function :", shopName);
  let processed = true;

  try {
    const shopSession = await PriceChangeDB.byShop(shopName);
    console.log("Session from database is :", shopSession);

  } catch (error) {
    processed = false;
    console.log("Error in database function execution :=> ", error.message);
  }
  return processed;
  // next();
}

export const getSaveAccessToken = async (req, res) => {
  // console.log("code on app instalation => ",req.query.code);
  // console.log("session on app instalation => ",res.locals.shopify.session);
  let processed = true;

  const accessToken = res.locals.shopify.session.accessToken;
  try {
    // await PriceChangeDB.deletebyShop(await getShopUrlFromSession(req, res));
    const shopFromDb = await PriceChangeDB.byShop(await getShopUrlFromSession(req, res));
    console.log("Shop exsist in database and shop is :=>", shopFromDb);
    if (shopFromDb) {
      console.log("As printed above shops exsist so we are insde condition.");

      const shopId = shopFromDb.id;
      console.log("Shop is :=>", shopId);
      const updateProduct = await PriceChangeDB.update(shopId, { access_token: accessToken, });
      console.log("Shop is already exsist so its token is updated and here it is :=>", updateProduct);
      const allShops = await PriceChangeDB.list();
      console.log("All shops and accessTokens in database are :=>", allShops);
    }
    else {
      const id = await PriceChangeDB.create({ access_token: accessToken, shopDomain: await getShopUrlFromSession(req, res), });
      const response = await PriceChangeDB.read(id);
      console.log("new shop and accessToken added in database is :=>", response);
      const allShops = await PriceChangeDB.list();
      console.log("All shops and accessTokens in database are :=>", allShops);
    }

  } catch (error) {
    processed = false;
    console.log("Error in database function execution :=> ", error.message);
  }
  return processed;
  // next();
}

export const getSession = async (shopName) => {
  // console.log("Request ibject insdie getSession function=>",shopName);
  // console.log("Response Object insdie getSession function=>",res);
  let response = {
    flag: true,
    session: null
  };
  try {
    const sessionObject = await PriceChangeDB.byShop(shopName);
    if (sessionObject) {
      response.session = sessionObject;
    }
    // console.log("Response from databse :=> ",sessionObject);
  } catch (error) {
    response.flag = false;
    console.log("Error in fetcging session from database:=>", error);
  }
  return response;
};

export const updateProduct = async (shop, varient) => {


  let newVariantsArray = [];
  let newPrice = 1000;
  let object2;
  let varintIdForDeliverProfile;
  let resObject = {
    workingFlag: true,
    message: null
  }

  if (varient.length != 0) {
    try {
      //   console.log("Shop from webhokk is =>",shop);
      let updateVarient = varient[0].id;
      console.log("varient fron webhook is=>", varient);
      const productId = varient[0].product_id;
      const sessionResponse = await getSession(shop);
      // console.log("Response from getSeeion function :=> ",sessionResponse);

      const cartProd = await shopify.api.rest.Product.find({
        session: sessionResponse.session,
        id: productId,
      });

      // console.log("Product from store is  :=> ",cartProd);
      if (cartProd && cartProd.variants != 0) {

        cartProd.variants.map((item) => {
          if (item.id === updateVarient) {
            object2 = {
              id: item.id,
              price: newPrice
            }
          } else {
            object2 = {
              id: item.id
            }
          }
          newVariantsArray.push(object2);
        });

        // console.log("New Array is   :=> ",newVariantsArray);

        const getResponse = await product_updater(sessionResponse.session, newVariantsArray, productId);

        if (getResponse.isOk) {

          resObject.message = "Varient price is changed.";


          getResponse.product.map((item) => {
            if (item.id === updateVarient) {
              varintIdForDeliverProfile = item.admin_graphql_api_id;
            }
          })
          // Session is built by the OAuth process

          // Session is built by the OAuth process

          // const carrier_service = new shopify.api.rest.CarrierService({session: sessionResponse.session});
          // carrier_service.name = "Shipwire"; 
          // carrier_service.callback_url ="https://troy-native-essence-requires.trycloudflare.com/carrier-service-callback";
          // carrier_service.service_discovery = true;
          //     const carrierService=await carrier_service.save({
          //         update: true,
          //         });

          // console.log("Carrier servie created",carrierService);


          //   const carrierServiesList=  await shopify.api.rest.CarrierService.all({
          //          session: sessionResponse.session,
          //        });

          // console.log("List of Carrier servies",carrierServiesList.data);

          // Session is built by the OAuth process

          //   const zonesList=await shopify.api.rest.ShippingZone.all({
          //                session: sessionResponse.session,
          //           });

          // console.log("List of Shping Zones servies",zonesList.data);


          // const shippingZoneId = 'YOUR_SHIPPING_ZONE_ID'; // Replace with the ID of the shipping zone you want to update

          // const carrierService = carrierServices.find(service => service.shipping_zone_id === shippingZoneId);
          // const carrierServiceId = carrierService.id



        } else {

        }

      } else {
        resObject.message = "Varient id received from webHook but Product not found on the store."
      }


    } catch (error) {
      console.log("Error in product update is =>", error);
      resObject.workingFlag = false;
      resObject.message = "Error in Product update";
    }
  } else {
    resObject.message = "Product function called without Error but carts empty mean user delete the last product also.";
  }
  return resObject;
}


export const getCheckout = async (shop, token, cartToken, userEmail, checkoutObject) => {
  // Session is built by the OAuth process
  let okFlag = true;

  try {

    console.log("Shop is :=>", shop);
    console.log("Token is :=>", token);
    console.log("Cart token is :=>", cartToken);
    console.log("User email is :=>", userEmail);

    const response = await getSession(shop);

    const clientApiResponse=await clientApi();
    console.log("Reponse from client API =>:",clientApiResponse);

    const createShipping=createShippingProfile(response.session)
    console.log("Response from the shipping create or update. =>: ",createShipping)

    // console.log("Checkout object is :=> ",checkoutObject);
    // console.log("Checkout object line items is :=> ",checkoutObject.line_items);

    // get checoutot object

    // Check out create 

    // let newArray=[];
    // let newObject={};
    // await checkoutObject.line_items.map((item)=>{
    //   newObject={
    //     variant_id:item.variant_id,
    //     quantity:item.quantity
    //   }
    //   newArray.push(newObject);
    //  })

    // Working fine and receive an checkout

    // const getCheckout =await shopify.api.rest.Checkout.find({
    //   session: response.session,
    //   token:token ,
    //  });

    //  console.log("Checkout response =>",getCheckout);


    // SOAP Client API Testing

    //  console.log("API URL FROM THE ENV:=>",process.env.CLIENT_API_URL)
    //  console.log("API TOKE FROM THE ENV:=>",process.env.CLIENT_API_TOKE)

  } catch (error) {
    okFlag = false;
    console.log("Error is : ", error);
  }

  return okFlag;
}






function clientApi() {
  let result;

  const url = process.env.CLIENT_API_URL;
  const params = {
    agdid: process.env.CLIENT_API_TOKEN
  };


  // // Construct the XML request payload
  const xmlPayload = xml.create({
    root: {
      productpricelist: {
        productPriceUpdateCollection: {
          product_skus: {
            item: {
              discount: '',
              id: '1',
              sku: '203614',
              qty: '1',
              plant: ''
            }
          },
          customer: [
            { item: { role: 'AG', number: '10005' } },
            { item: { role: 'WE', number: '10005' } },
            { item: { role: 'RE', number: '10005' } }
          ],
          quote_id: '0',
          discounts: {
            item: {
              type: '',
              value: '',
              cause: ''
            }
          }
        }
      }
    }
  }).end({ pretty: true });

  const requestUrl = new URL(url);
  requestUrl.searchParams.append('agdid', params.agdid);

  fetch(requestUrl.toString(), {
    method: 'POST',
    body: xmlPayload,
    headers: {
      'Content-Type': 'text/xml'
    }
  })
    .then(response => response.text())
    .then(data => {
      console.log("Data from the client API => ", data);
      result={
        "BAPI_SALESORDER_SIMULATE": {
          "cart_data": {
            "Totalpricewithouttax": "100.00",
              "Totaltaxamount": "10.00",
                "Totalprice": "110.00",
                  "line_items": {
              "line_item": [
                {
                  "totalitem1price": "50.00",
                  "quantity": "2"
                },
                {
                  "totalitem2price": "30.00",
                  "quantity": "3"
                }
              ]
            }
          }
        }
      };
    })
    .catch(error => {
      console.error("Error from the Client API:=> ", error);
      result=error;
    });
return result;
}


async function createShippingProfile (session){
  
  const deliverProfileList = await deliverProfileGet(session);
  const deliverProfileArray = deliverProfileList.body.data.deliveryProfiles.edges;


  console.log("Deliver Profile List is =>", deliverProfileArray);

  var deliveryProfileName = "NEW SAP SHIPPING";

  var includesDesiredName = includesName(deliverProfileArray, deliveryProfileName);

  console.log("Get Delivery Profile response :=>", includesDesiredName);

  // console.log("Location Group:=>",includesDesiredName.deliveryProfile.profileLocationGroups)

  // deliverProfileVaribles.profile.variantsToAssociate.push(varintIdForDeliverProfile);


  if (includesDesiredName.isOk) {
    console.log("Deliver Profile Already exisit. Now Updating.");

    const deliverProfileId = includesDesiredName.deliveryProfile.id;
    const locationGroupId = includesDesiredName.deliveryProfile.profileLocationGroups[0].locationGroup.id;
    const zoneId = includesDesiredName.deliveryProfile.profileLocationGroups[0].locationGroupZones.edges[0].node.zone.id;
    const methodId = includesDesiredName.deliveryProfile.profileLocationGroups[0].locationGroupZones.edges[0].node.methodDefinitions.edges[0].node.id;
    const rateId = includesDesiredName.deliveryProfile.profileLocationGroups[0].locationGroupZones.edges[0].node.methodDefinitions.edges[0].node.rateProvider.id;

    const testData = includesDesiredName.deliveryProfile.profileLocationGroups;
    console.log("profileLocationGroups is =>", testData)

    // const listOfCountris=await taxchange(sessionResponse.session);
    // console.log("List of Countries :=> ",listOfCountris.listOfCountris.data);

    // const requiredCountry=await getCountry(listOfCountris.listOfCountris.data,"PK");
    // console.log("Required Counrty is => ",requiredCountry);

    // const taxUpdate=await updateCountryTax(sessionResponse.session,requiredCountry.country.id,10)

    console.log("Delivery Proile ID needs to update :=>", deliverProfileId);
    console.log("Delivery Location Group needs to update :=>", locationGroupId);
    console.log("Delivery zoneId needs to update :=>", zoneId);
    console.log("Delivery methodId needs to update :=>", methodId);
    console.log("Delivery rateId needs to update :=>", rateId);



    const myJason = JSON.stringify(includesDesiredName.deliveryProfile);
    console.log("Deliver Profile Locations Array")
    const object = JSON.parse(myJason);
    console.log(JSON.stringify(object, null, 2));

    updateDP.profile.locationGroupsToUpdate[0].id = locationGroupId;
    updateDP.profile.locationGroupsToUpdate[0].zonesToUpdate[0].id = zoneId;
    updateDP.profile.locationGroupsToUpdate[0].zonesToUpdate[0].methodDefinitionsToUpdate[0].id = methodId;
    updateDP.profile.locationGroupsToUpdate[0].zonesToUpdate[0].methodDefinitionsToUpdate[0].rateDefinition.id = rateId;


    // const updateDeliver=await updateDeliverProfile(sessionResponse.session,deliverProfileId,updateDP.profile);
    // console.log("Deliver Profile  is =>",updateDeliver);

    const updateShipping= await UpdateeShipping(deliverProfileId,locationGroupId,zoneId,session);

    console.log("Response from shipping update :=> ",updateShipping.body.data.deliveryProfileUpdate);

  } else {

    const locations = await getLocations(session);
    const newLocation = await reArrangeArrayofLocations(locations);

    deliverProfileVaribles.profile.locationGroupsToCreate[0].locations = newLocation;

    console.log("Locations are :=> ", locations);

    const deliverProfile=await createDeliverProfile(session,deliverProfileVaribles.profile);
    console.log("Deliver Profile Created is =>",deliverProfile.body.data.deliveryProfileCreate);
  }
}

function includesName(array, name) {

  let responseObj = {
    isOk: false,
    deliveryProfile: null
  }
  for (var i = 0; i < array.length; i++) {
    if (array[i].node.name === name) {
      responseObj.deliveryProfile = array[i].node;
      responseObj.isOk = true;
      return responseObj;
    }
  }
  return responseObj;
}


function reArrangeArrayofLocations(inputArray) {
  const outputArray = inputArray.map(item => item.id);
  return outputArray;
}

function getCountry(array, code) {

  let responseObj = {
    isOk: false,
    country: null
  }
  for (var i = 0; i < array.length; i++) {
    if (array[i].code === code) {
      responseObj.country = array[i];
      responseObj.isOk = true;
      return responseObj;
    }
  }
  return responseObj;
}
