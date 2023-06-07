/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";
import shopify from "./shopify.js";

const DEFAULT_DB_FILE = path.join(process.cwd(), "database.sqlite");

export const PriceChangeDB = {
  shopify_session:"shopify_sessions",
  db: null,
  ready: null,

  create: async function ({ shopDomain, access_token,}) {
    await this.ready;
      const query = `
      INSERT INTO ${this.shopify_session}
      (shopDomain, access_token)
      VALUES (?, ?)
      RETURNING id;
    `;

    const rawResults = await this.__query(query, [
      shopDomain,
      access_token,
    ]);
    
    return rawResults[0].id;
  },

  update: async function (id,{access_token}) {


    await this.ready;

    const query = `
      UPDATE ${this.shopify_session}
      SET
        access_token = ?
      WHERE 
      id = ?;
    `;
    console.log("ID :",id,"Access Toke:",access_token);
    console.log("Update Query:",query)
    await this.__query(query, [
      access_token,
      id,
    ]);
    return true;
  },

  list: async function () {
    await this.ready;
    const query = `
      SELECT * FROM ${this.shopify_session};
    `;

    const results = await this.__query(query);
    return results;

    // return results.map((tokens) => this.__addImageUrl(qrcode));
  },
  byShop: async function (shopDomain) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.shopify_session}
      WHERE shop = ?;
    `;

    const results = await this.__query(query, [shopDomain]);
    return results[0];

    // return results.map((tokens) => this.__addImageUrl(qrcode));
  },

  read: async function (id) {
    await this.ready;
    const query = `
      SELECT * FROM ${this.shopify_session}
      WHERE id = ?;
    `;
    const rows = await this.__query(query, [id]);
    if (!Array.isArray(rows) || rows?.length !== 1) return undefined;

    return rows[0];
  },

  deletebyId: async function (id) {
    await this.ready;
    const query = `
      DELETE FROM ${this.shopify_session}
      WHERE id = ?;
    `;
    await this.__query(query, [id]);
    return true;
  },
  deletebyShop: async function (shopDomain) {
    await this.ready;
    const query = `
      DELETE FROM ${this.shopify_session}
      WHERE shopDomain = ?;
    `;
    await this.__query(query, [shopDomain]);
    return true;
  },

  __hasshopsAccessTokeTable: async function () {
    const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
    const rows = await this.__query(query, [this.shopify_session]);
    return rows.length === 1;
  },

  /* Initializes the connection with the app's sqlite3 database */
  init: async function () {
    /* Initializes the connection to the database */
    this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

    const hasshopsAccessTokeTable = await this.__hasshopsAccessTokeTable();

    if (hasshopsAccessTokeTable) {
      this.ready = Promise.resolve();

      /* Create the QR code table if it hasn't been created */
    } else {
      const query = `
        CREATE TABLE IF NOT EXISTS ${this.shopify_session} (
          id VARCHAR(255) NOT NULL PRIMARY KEY,
          shop VARCHAR(255) NOT NULL,
          state VARCHAR(255) NOT NULL,
          isOnline integer NOT NULL,
          expires integer,
          scope varchar(1024),
          accessToken varchar(255),
          onlineAccessInfo varchar(255)
        )
      `;

      /* Tell the various CRUD methods that they can execute */
      this.ready = this.__query(query);
    }
  },

  /* Perform a query on the database. Used by the various CRUD methods. */
  __query: function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
            console.log("Rejected due to error : ",err)
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },
//   __shopslist: function (qrcode) {
//     try {
//       qrcode.imageUrl = this.__generateQrcodeImageUrl(qrcode);
//     } catch (err) {
//       console.error(err);
//     }

//     return qrcode;
//   },


  
};

/* Generate the URL to a product page */
function productViewURL({ host, productHandle, discountCode }) {
  const url = new URL(host);
  const productPath = `/products/${productHandle}`;

  /* If this QR Code has a discount code, then add it to the URL */
  if (discountCode) {
    url.pathname = `/discount/${discountCode}`;
    url.searchParams.append("redirect", productPath);
  } else {
    url.pathname = productPath;
  }

  return url.toString();
}

/* Generate the URL to checkout with the product in the cart */
function productCheckoutURL({ host, variantId, quantity = 1, discountCode }) {
  const url = new URL(host);
  const id = variantId.replace(
    /gid:\/\/shopify\/ProductVariant\/([0-9]+)/,
    "$1"
  );

  /* The cart URL resolves to a checkout URL */
  url.pathname = `/cart/${id}:${quantity}`;

  if (discountCode) {
    url.searchParams.append("discount", discountCode);
  }

  return url.toString();
}