import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken, authenticatedFetch } from "@shopify/app-bridge-utils";
// import {ProductPrice} from "../components";


export async function Index() {
   const app = useAppBridge();
   //const aFetch = authenticatedFetch(app);
   const token = await getSessionToken(app);
        console.log("haseeb", token);
        

   async function getCheckouts() {
       const token = await getSessionToken(app);
        console.log("haseeb", token);
       const response = await fetch("/api/checkouts", {
           headers: { "Authorization": `Bearer ${token}` }
       });
       //const response = await aFetch("/api/checkouts");
       const checkouts = await response.json();

       console.log(checkouts);
   }

  return (
    <Page>
    </Page>
  );
}