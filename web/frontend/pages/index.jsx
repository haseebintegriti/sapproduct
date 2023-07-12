import {
  Page,
  Layout,
  Image,
  Link,
  Text,
  Form,
  FormLayout,
  TextField,
  Button,
  AlphaCard
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

import { trophyImage } from "../assets";

import { ProductsCard} from "../components";


export default function HomePage() {
  const [isResult, setIsResult] = useState(false);
  const [isProdData, setIsProdData] = useState(false);
  const [prodData, setProdData] = useState();
  
  function product_data(){
    setIsProdData(true);
  }
  useEffect(() => {
    console.log("UseEffect function is running!")
    if(prodData){
    product_data();
    }
  }, [prodData]);
  let productData = [];

  const fetch = useAuthenticatedFetch();
  const handleUpdate = async () => {
    const response = await fetch("/api/products/update");

    if (response.ok) {
      console.log(response)
    } else {
      console.log("Not Updated");
    }
  };

  const listProducts = async () => {
    const response = await fetch("/api/products/list");
    if (response.ok) {
      setIsResult(true);
      const result = await response.json();
      productData = result.data;
      setProdData(productData);
      console.log("Congratulations, We have a list of products!", productData);
      // const backendObject = response.json();
      // console.log("Backend Object: ",backendObject.object.data)
    } else {
      console.log("Api Call Error Bro!");
    }
    console.log("Inside List Product", productData);
  }
  
  if(isResult){
    console.log("prodData variable is updated...", prodData);
  }else{
    console.log("prodData variable is not updated...");
  }
  
  return (
    <Page fullWidth>
      <TitleBar title="SAP Real Time Pricing" primaryAction={null} />
      <Layout>
        <Layout.Section>
          {/* <Form onSubmit={handleUpdate}>
            <FormLayout>
              <TextField
                type="number"
                label="Number of Order Count"
                autoComplete="off"
              ></TextField>
              <Button submit>Submit</Button>
            </FormLayout>
          </Form> */}
          {/* <Button onClick={listProducts}>Get List of Products</Button> */}
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
          {/* <ProductPrice /> */}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
