import React, { FunctionComponent } from "react";
import { Router } from "@reach/router";
import "nes.css/css/nes.min.css";

import "./App.scss";
import { stores, StoresProvider } from "./stores/stores";
import { RoomPage } from "./pages/RoomPage/RoomPage";

const App: FunctionComponent = () => {
  return (
    <StoresProvider value={stores}>
      <Router className={"AppRouter"}>
        <RoomPage path="/:roomName" />
      </Router>
    </StoresProvider>
  );
};

export default App;
