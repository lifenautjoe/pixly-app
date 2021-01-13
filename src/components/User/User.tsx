import React, { CSSProperties, FunctionComponent, useRef, useState } from "react";
import { IUserData } from "../../core/interfaces/model-data/IUserData";
import "./User.scss";
import { Avatar } from "../Avatar";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/stores";
import { Message } from "../Message/Message";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

interface IUserProps {
  user: IUserData;
  style?: CSSProperties;
  authenticatedUserElRef: HTMLDivElement | null;
}

export const User: FunctionComponent<IUserProps> = observer(({ user, style, authenticatedUserElRef }: IUserProps) => {
  const pixlyStore = useStore("pixlyStore");
  const userElementRef = useRef<HTMLDivElement>(null);
  const [windowDimensions] = useState(getWindowDimensions());

  const userLatestMessage = pixlyStore.getUserLatestMessage(user);

  let distance = 0;
  const isNotAuthenticatedUser = authenticatedUserElRef && pixlyStore.user?.socketId !== user.socketId;

  if (isNotAuthenticatedUser) {
    // These changes only apply to other users, not ours
    const userElementBoundingRect = userElementRef.current?.getBoundingClientRect();
    const authenticatedUserElementBoundingRect = authenticatedUserElRef?.firstElementChild?.getBoundingClientRect();

    if (userElementBoundingRect && authenticatedUserElementBoundingRect) {
      const xDistance = Math.abs(authenticatedUserElementBoundingRect.x - userElementBoundingRect.x);
      const yDistance = Math.abs(authenticatedUserElementBoundingRect.y - userElementBoundingRect.y);

      // Pythagoras theorem
      distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    }
  }

  const scalePercentage = 100 - (distance / windowDimensions.width) * 100;

  const styles = {
    fontSize: isNotAuthenticatedUser ? `${100 + scalePercentage * 1.5}%` : "",
  };

  return (
    <div className="User" style={style} ref={userElementRef}>
      {userLatestMessage && (
        <div className="UserMessage" style={styles}>
          <Message message={userLatestMessage} />
        </div>
      )}
      <Avatar avatarId={user.avatar} />
      <p>{user.name}</p>
    </div>
  );
});
