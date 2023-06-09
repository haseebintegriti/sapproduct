import shopify from "../shopify.js";
import { PriceChangeDB } from "../price-change-db.js";
import {product_updater} from '../product-updater.js';
import {dilvery_change,deliverProfileGet}  from "../change-delivery-profile.js";

export async function getShopUrlFromSession(req, res) {
    return `https://${res.locals.shopify.session.shop}`;
  }

export const getSessionFromDB= async (shopName)=>{

    console.log("req inside the function :",shopName);
    let processed =true;

    try {
    const shopSession=await PriceChangeDB.byShop(shopName);
    console.log("Session from database is :",shopSession);
           
    } catch (error) {
      processed=false;
      console.log("Error in database function execution :=> ",error.message);
    }
    return processed;
    // next();
  }

  export const getSaveAccessToken= async (req,res)=>{
    // console.log("code on app instalation => ",req.query.code);
    // console.log("session on app instalation => ",res.locals.shopify.session);
    let processed =true;

    const accessToken=res.locals.shopify.session.accessToken;
    try {
      // await PriceChangeDB.deletebyShop(await getShopUrlFromSession(req, res));
      const shopFromDb=await PriceChangeDB.byShop(await getShopUrlFromSession(req, res));
      console.log("Shop exsist in database and shop is :=>",shopFromDb);
      if(shopFromDb){
        console.log("As printed above shops exsist so we are insde condition.");

        const shopId=shopFromDb.id;
        console.log("Shop is :=>",shopId);
        const updateProduct=await PriceChangeDB.update(shopId,{access_token:accessToken,});
        console.log("Shop is already exsist so its token is updated and here it is :=>",updateProduct);
        const allShops=await PriceChangeDB.list();
        console.log("All shops and accessTokens in database are :=>",allShops);
      }
       else{  
        const id = await PriceChangeDB.create({access_token:accessToken,shopDomain: await getShopUrlFromSession(req, res),});
        const response = await PriceChangeDB.read(id);
        console.log("new shop and accessToken added in database is :=>",response);
        const allShops=await PriceChangeDB.list();
        console.log("All shops and accessTokens in database are :=>",allShops);
      }
           
    } catch (error) {
      processed=false;
      console.log("Error in database function execution :=> ",error.message);
    }
    return processed;
    // next();
  }

  export const getSession=async (shopName)=>{
    // console.log("Request ibject insdie getSession function=>",shopName);
    // console.log("Response Object insdie getSession function=>",res);
    let response={
        flag:true,
        session:null
    };
    try {
        const sessionObject=await PriceChangeDB.byShop(shopName);
        if (sessionObject) {
            response.session=sessionObject;
        }
        // console.log("Response from databse :=> ",sessionObject);
    } catch (error) {
        response.flag=false;
        console.log("Error in fetcging session from database:=>",error);
    }
    return response;
  };

  export const updateProduct=async(shop,varient)=>{


    let newVariantsArray = [];
    let newPrice=1000;
    let object2;
    let resObject={
        workingFlag:true,
        message:null
    }

if (varient.length != 0) {
    try {
        //   console.log("Shop from webhokk is =>",shop);
        let updateVarient=varient[0].id;
        // console.log("varient fron webhook is=>",varient);
        const productId=varient[0].product_id;
        const sessionResponse=await getSession(shop);
        // console.log("Response from getSeeion function :=> ",sessionResponse);
    
        const cartProd = await shopify.api.rest.Product.find({
            session: sessionResponse.session,
            id: productId,
          });
    
          // console.log("Product from store is  :=> ",cartProd);
        if (cartProd && cartProd.variants !=0) {
         
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

        const getResponse = await product_updater(sessionResponse.session, newVariantsArray,productId);

        if(getResponse){
          resObject.message="Varient price is changed.";
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

              const deliverProfile=await dilvery_change(sessionResponse.session);

              // const myJSON = JSON.stringify(deliverProfile.body)
              console.log("Deliver Profile Created is =>",deliverProfile);
              
              const deliverProfileList=await deliverProfileGet(sessionResponse.session);
              console.log("Deliver Profile List is =>",deliverProfileList);

          // const currentUrl=`https://${shop}?`


        }else{

        }

        } else {
            resObject.message="Varient id received from webHook but Product not found on the store."
        }
       
    
        } catch (error) {
          console.log("Error in product update is =>",error);
          resObject.workingFlag=false;
          resObject.message="Error in Product update";
        }
}else{
    resObject.message="Product function called without Error but carts empty mean user delete the last product also.";
}
return resObject;
}


export const getCheckout=async(shop,token,cartToken,userEmail)=>{
  // Session is built by the OAuth process
 let okFlag=true;

try {

  console.log("Shop is :=>",shop)
  console.log("Token is :=>",token)
  console.log("Cart token is :=>",cartToken)
  console.log("User email is :=>",userEmail)

  const response=await getSession(shop);

  console.log("Session :=>", response.session);

  // get checoutot object




// Check out create 
  
//   let newArray=[];
//   let newObject={};
//   await getCheckout.line_items.map((item)=>{
//     newObject={
//       variant_id:item.variant_id,
//       quantity:item.quantity
//     }
//     newArray.push(newObject);
//    })

//    console.log("Getting new array :=>",newArray);

// const checkout = new shopify.api.rest.Checkout({session: response.session});
// checkout.line_items = newArray;

// const testCreateCheckOut=await checkout.save({
//   update: true,
// });

// console.log("New checkout is created :=>",testCreateCheckOut);

  //  const checkoutCreate = new shopify.api.rest.Checkout({session: response.session});
  //  checkoutCreate.line_items =getCheckout.line_items;

  //  const newCheckoutCreated=await checkoutCreate.save({
  //     update: true,
  //   });

  //   console.log("New checkout is created :=>",newCheckoutCreated);


// create checkout end


// update shipping start
// const checkout = new shopify.api.rest.Checkout({session: response.session});
// checkout.token = token;
// checkout.email = "sajidmasood351@gmail.com";
// checkout.shipping_line={
//   "handle": "shopify-Free%20Shipping-0.00",
//   "price": "100",
//   "title": "SAP SHIPPING",
//   "tax_lines": []
// };

// const updatedShipping= await checkout.save({
//   update: true,
// });

// console.log("shiping update is :=>",updatedShipping)


// Working fine and receive an checkout

const getCheckout =await shopify.api.rest.Checkout.find({
  session: response.session,
  token: 'exuw7apwoycchjuwtiqg8nytfhphr62a',
 });

 console.log("Checkout response =>",getCheckout);



//  Below code return and 404 error

const checkout = new shopify.api.rest.Checkout({session: response.session});
checkout.token = 'exuw7apwoycchjuwtiqg8nytfhphr62a';
checkout.phone=12345;

const updatedShippingPhone=await checkout.save({
  update: true,
});

console.log("shiping update is :=>",updatedShippingPhone)


// const checkout = new shopify.api.rest.Checkout({session: response.session});
// checkout.token = "aa27a54a2cb70db67f411a75ef9c4e5e";
// checkout.email = userEmail;
// checkout.shipping_address = {
//   "first_name": "John",
//   "last_name": "Smith",
//   "address1": "126 York St.",
//   "city": "Los Angeles",
//   "province_code": "CA",
//   "country_code": "US",
//   "phone": "(123)456-7890",
//   "zip": "90002"
// };
// const updatedShippingAddress=await checkout.save({
//   update: true,
// });

// console.log("shiping update is :=>",updatedShippingAddress)







// update shipping end





// Get shipping Rates start

// const shippingRates=await shopify.api.rest.Checkout.shipping_rates({
//   session: response.session,
//   token: token,
// });

// console.log("Shipping Rates response =>",shippingRates);

// Get shipping rates end


// const checkout = new shopify.api.rest.Checkout({session: response.session});
// checkout.token = token;
// checkout.shipping_line = {
//   "handle": "shopify-Standard-0.00"
// };
// const updatedShip=await checkout.save({
//   update: true,
// });


  // console.log("Update shipping response =>",updatedShip);

  // console.log("check out object is =>",Checkout);
  
} catch (error) {
  okFlag=false;
  console.log("Error is : ",error);
}

return okFlag;
}