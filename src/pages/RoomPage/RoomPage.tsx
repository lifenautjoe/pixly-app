import { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import "./RoomPage.scss";
import { useStore } from "../../hooks/stores";
import { observer } from "mobx-react-lite"; // Or "mobx-react".
import { Room } from "../../components/Room/Room";
import { AuthModal } from "../../components/AuthModal/AuthModal";
import React from "react";
interface IRoomPageProps extends RouteComponentProps {
  roomName?: string;
}

export const RoomPage: FunctionComponent<IRoomPageProps> = observer(props => {
  const appStore = useStore("appStore");

  let roomName = props.roomName;

  if (!roomName) {
    roomName = "hq";
  }

  return appStore.isAuthenticated ? <Room roomName={roomName} /> : <AuthModal roomName={roomName} />;
});
