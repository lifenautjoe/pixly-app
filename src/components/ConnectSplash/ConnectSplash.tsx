import { FunctionComponent, useEffect, useState } from "react";
import React from "react";
import "./ConnectSplash.scss";
import { useStore } from "../../hooks/stores";

export const ConnectSplash: FunctionComponent = () => {
const [errorMessage, setErrorMessage] = useState("");
  const pixlyStore = useStore("pixlyStore");

  useEffect(() => {
    if (pixlyStore.errorMessage) {
      setErrorMessage(pixlyStore.errorMessage);
      pixlyStore.clearErrorMessage();
    } else {
      pixlyStore.connect();
    }
  }, []);

  return (
    <div className={"ConnectSplash"}>
      <div className="ConnectSplashMessage">
        <div className="nes-container with-title is-centered">
          <h2>{`${errorMessage ? "Oh no..." : "Connecting..."}`}</h2>
          {errorMessage && (
            <div className="ConnectSplashMessageErrors">
              <p className="nes-text is-error">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
