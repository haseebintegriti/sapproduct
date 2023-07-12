import { useState } from "react";
import { Card, Text } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { Container, Row, Col } from 'react-bootstrap';
import css from "../assets/css/wellcomecard.css";




export function ProductsCard() {
  const fetch = useAuthenticatedFetch();
  return (
    <>
      <Container >
        <Row>
          <Col >
            <div className="wellcome_card shadow-none p-3 bg-light rounded">
              <div className="image_part">
              <img src="../assets/celebration_img.png" width="200px"/>
              </div>
              <div className="heading_part">
                <h3 className="wellcome_heading">
                  Welcome to the App
                </h3>
              </div>
              <div>
                <p className="discription">
                  It is real time product pricing update app. It will get product prices from SAP and update in shopify on real time.
                </p>
              </div>
            </div>
            </Col>  
        </Row>
      </Container>
    </>
  );
}


