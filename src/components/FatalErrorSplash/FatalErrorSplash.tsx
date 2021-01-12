import { FunctionComponent } from "react";
import React from "react";
import "./FatalErrorSplash.scss";

interface FatalErrorSplashProps {
  errorMessage: string;
}

export const FatalErrorSplash: FunctionComponent<FatalErrorSplashProps> = ({ errorMessage }: FatalErrorSplashProps) => {
  return (
    <div className={"FatalErrorSplash"}>
      <div className="FatalErrorSplashMessage">
        <div className="nes-container with-title is-centered">
          <h2>Fatal error</h2>
          <div className="FatalErrorSplashMessageErrors">
            <h3 className="nes-text is-error">{errorMessage}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
