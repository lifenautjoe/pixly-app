import { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import "./Room.scss";
import { useStore } from "../../hooks/stores";

interface IRoomPageProps extends RouteComponentProps {
  roomName?: string;
}

export const Room: FunctionComponent<IRoomPageProps> = props => {
  const appStore = useStore("appStore");

  return null;
};
