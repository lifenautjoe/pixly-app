import React, { FunctionComponent } from "react";
import { Redirect, Router } from "@reach/router";
import "nes.css/css/nes.min.css";

import "./App.scss";
import { stores, StoresProvider } from "./stores/stores";
import { RoomPage } from "./pages/RoomPage/RoomPage";

const App: FunctionComponent = () => {
  return (
    <StoresProvider value={stores}>
      <Router>
        <Redirect from="/" to="/hq" />
        <RoomPage path="/:roomName?"></RoomPage>
      </Router>
    </StoresProvider>
  );
};

export default App;
