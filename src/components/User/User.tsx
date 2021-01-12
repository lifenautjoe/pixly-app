import React, { CSSProperties, FunctionComponent } from "react";
import { IUserData } from "../../core/interfaces/model-data/IUserData";
import "./User.scss";
import { Avatar } from "../Avatar";

interface IUserProps {
  user: IUserData;
  style?: CSSProperties;
}

export const User: FunctionComponent<IUserProps> = ({ user, style }: IUserProps) => {
  return (
    <div className="User" style={style}>
      <Avatar avatarId={user.avatar} />
      <p>{user.name}</p>
    </div>
  );
};
