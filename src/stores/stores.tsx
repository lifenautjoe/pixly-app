import React from "react";
import { PixlyStore } from "./PixlyStore";

const pixlyEndpoint = process.env.REACT_APP_PIXLY_ENDPOINT;

if (!pixlyEndpoint) {
  throw new Error("Environment variable REACT_APP_PIXLY_ENDPOINT is required");
}

export const stores = Object.freeze({
  pixlyStore: new PixlyStore({
    endpoint: pixlyEndpoint,
  }),
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
