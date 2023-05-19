import shopify from "../shopify.js";
import { PriceChangeDB } from "../price-change-db.js";

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
    console.log("Request ibject insdie getSession function=>",shopName);
    // console.log("Response Object insdie getSession function=>",res);
    let workingFlag=true;
    try {
        const sessionObject=await PriceChangeDB.byShop(shopName);
        console.log("Response from databse :=> ",sessionObject)
    } catch (error) {
        workingFlag=false;
    }
    return workingFlag;
  }