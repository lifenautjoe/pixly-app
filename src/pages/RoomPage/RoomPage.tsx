import { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import "./RoomPage.scss";
import { useStore } from "../../hooks/stores";

interface IRoomPageProps extends RouteComponentProps {
  roomName?: string;
}

export const RoomPage: FunctionComponent<IRoomPageProps> = props => {
  const appStore = useStore("appStore");

  return null;
};
