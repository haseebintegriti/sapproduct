;import shopify from "../shopify.js";

export const taxchange=async(session)=>{
    // Session is built by the OAuth process
let responseObj={
    okFlag:true,
    listOfCountris:null
};

try {
    const listOfCountris=await shopify.api.rest.Country.all({
        session: session,
      });
    responseObj.listOfCountris=listOfCountris;

    
} catch (error) {
    responseObj.okFlag=false;
}

  return responseObj;
}

export const updateCountryTax=async(session,cId,taxAmount)=>{
    // Session is built by the OAuth process
try {
    
    console.log("Country ID =>",cId);
    console.log("Tax amount =>",taxAmount);

    const test=await shopify.api.rest.Country.delete({
        session: session,
        id:cId,
    })
    console.log("Update tax value => ",test);


    // Session is built by the OAuth process

    const createCountry = new shopify.api.rest.Country({session: session});
    createCountry.code = "IN";
    const newCountry=await createCountry.save({
       update: true,
    });

console.log("Country is created",newCountry);


    const country = new shopify.api.rest.Country({session: session});
    country.id = cId;
    country.tax = taxAmount;
    await country.save({
        update: true,
    });

// console.log("Tax values is changed =>",updateTaxAmount);

} catch (error) {
    console.log("Error in tax update.",error)
}


}