import React, { CSSProperties, FunctionComponent } from "react";
import { IUserData } from "../../core/interfaces/model-data/IUserData";
import "./User.scss";
import { Avatar } from "../Avatar";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/stores";
import { Message } from "../Message/Message";

interface IUserProps {
  user: IUserData;
  style?: CSSProperties;
}

export const User: FunctionComponent<IUserProps> = observer(({ user, style }: IUserProps) => {
  const pixlyStore = useStore("pixlyStore");

  const userLatestMessage = pixlyStore.getUserLatestMessage(user);

  return (
    <div className="User" style={style}>
      {userLatestMessage && (
        <div className="UserMessage">
          <Message message={userLatestMessage} />
        </div>
      )}
      <Avatar avatarId={user.avatar} />
      <p>{user.name}</p>
    </div>
  );
});
