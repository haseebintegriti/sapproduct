import { useState, useCallback } from "react";
import { AlphaCard, Thumbnail, Text, Layout, HorizontalStack, HorizontalGrid, Button, Form, FormLayout, TextField, Page } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function Card({ id, title, variants, images }) {
    const [showButton, setShowButton] = useState(false);
    const [value, setValue] = useState("30");
    const handleChange = useCallback((newValue) => setValue(newValue), []);
    const fetch = useAuthenticatedFetch();

    const sendProductInfo = useCallback(async (prodID, variants) => {

        console.log("hello product on submit", prodID);
        console.log("hello price on submit", value);
        let response;
        try {
            response = await fetch('/api/product/pricechange', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "id": prodID,
                    "price": value,
                    "variants":variants
                })
            });
            // console.log("Response from frontend!", response);
        } catch (error) {
            // TypeError: Failed to fetch
            console.log('There was an error fetching the api...!', error);
        }

        if (response?.ok) {
            // await refetchProductCount();
            console.log("Backend api called from frontend")
        } else {
            // setIsLoading(false);
            console.log("Backend api not called from frontend")
        }
    });


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
                        <HorizontalStack wrap={false}>
                            <Text>
                                {variant.price}
                            </Text>
                            <Text>Available Inventory {variant.inventory_quantity}</Text>
                        </HorizontalStack>
                    )
                })}
                {showButton ? <Form onSubmit={() => sendProductInfo(id, variants)}>
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