import { useState, useCallback } from "react";
import { AlphaCard, Thumbnail, Text, Layout, HorizontalStack, HorizontalGrid, Button, Form, FormLayout, TextField, Page } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function Card({ id, title, variants, images }) {
    const [showButton, setShowButton] = useState(false);
    const [value, setValue] = useState("30");
    const handleChange = useCallback((newValue) => setValue(newValue), []);
    const fetch = useAuthenticatedFetch();
    // const sendProductInfo = async (prodID, prodTitle) => {
    //     console.log("Details of product to update...!", prodID, prodTitle, value);
    //     const body = {
    //         productID: prodID,
    //         price:value
    //     }
    //     const options = {
    //         method: 'post',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(body)
    //     };
    //     const response = await fetch("/api/products/update", options);

    //     if (response.ok) {
    //         console.log(response)
    //     } else {
    //         console.log("Not Updated");
    //     }
    // };
    const sendProductInfo = useCallback(async(prodID, prodTitle) => {
        console.log("hello product on submit",prodID);
        console.log("hello price on submit",prodTitle);
    
        const options=  {
        method:"post",
        body:JSON.stringify({
          id:prodID,
          price:value
        }),
        headers: { "Content-Type": "application/json" },
        }
        
        // setIsLoading(true);
        const response = await fetch("/api/products/update", options);
    
     
        if (response.ok) {
          // await refetchProductCount();
          console.log("Backend api called fron frontend")
        } else {
          // setIsLoading(false);
          console.log("Backend api not called fron frontend")
        }
    
      
        
      },[value]);
    

    return (
            <Layout.Section key={id} oneThird> 
                <AlphaCard>
                    <HorizontalGrid gap="4" columns={6}>
                        {images.map((image) => {
                            return (
                                <Thumbnail key={image.id} source={image.src} size="medium" oneThird />
                            )
                        })}
                    </HorizontalGrid>
                    <Text>{title}</Text>
                    {variants.map((variant) => {

                        return (
                            <Text>
                                {variant.price}
                            </Text>
                        )
                    })}
                    {showButton ? <Form onSubmit={() => sendProductInfo(id, title)}>
                        <FormLayout>
                            <TextField
                                type="number"
                                label="Set Price"
                                autoComplete="off"
                                value={value}
                                onChange={handleChange}
                            ></TextField>
                            <Button submit>Update</Button>
                        </FormLayout>
                    </Form> :
                        <Button onClick={() => setShowButton(true)}>Update Price</Button>
                    }
                </AlphaCard>
            </Layout.Section>
    )
}