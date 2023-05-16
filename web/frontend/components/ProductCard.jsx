import { useState, useCallback } from "react";
import { AlphaCard, Thumbnail, Text, Layout, HorizontalStack, HorizontalGrid, Button, Form, FormLayout, TextField } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import Card from './card';


export function ProductCard({ data }) {
  console.log("product Card Data", data);

  return (
    <Layout>
      {data.map(({ id, title, variants, images }) => {
        return (
          <>
          <Card key={id} id={id} title={title} variants={variants} images={images} />
          </>
        )
      })}
    </Layout>
  )
}