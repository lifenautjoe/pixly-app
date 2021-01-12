import React from "react";
import { AppStore } from "./AppStore";

const pixlyEndpoint = process.env.REACT_APP_PIXLY_ENDPOINT;

if (!pixlyEndpoint) {
  throw new Error("Environment variable REACT_APP_PIXLY_ENDPOINT is required");
}

export const stores = Object.freeze({
  appStore: new AppStore({
    pixlyEndpoint: pixlyEndpoint,
  }),
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
