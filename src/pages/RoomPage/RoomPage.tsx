import { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import "./RoomPage.scss";
import { useStore } from "../../hooks/stores";
import { observer } from "mobx-react-lite"; // Or "mobx-react".
import { Room } from "../../components/Room/Room";
import { AuthSplash } from "../../components/AuthSplash/AuthSplash";
import React from "react";
import { ConnectSplash } from "../../components/ConnectSplash/ConnectSplash";
import { FatalErrorSplash } from "../../components/FatalErrorSplash/FatalErrorSplash";
interface IRoomPageProps extends RouteComponentProps {
  roomName?: string;
}

export const RoomPage: FunctionComponent<IRoomPageProps> = observer(({ roomName }: IRoomPageProps) => {
  const pixlyStore = useStore("pixlyStore");

  // Validate room name
  if (!roomName) return null;

  if (pixlyStore.fatalErrorMessage) {
    return <FatalErrorSplash errorMessage={pixlyStore.fatalErrorMessage} />;
  }

  if (!pixlyStore.connected) {
    return <ConnectSplash />;
  }

  return pixlyStore.isAuthenticated ? <Room name={roomName} /> : <AuthSplash roomName={roomName} />;
});
