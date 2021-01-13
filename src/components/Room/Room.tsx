import { CSSProperties, FunctionComponent, useEffect, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { useStore } from "../../hooks/stores";
import React from "react";
import "./Room.scss";
import { observer } from "mobx-react-lite";
import { User } from "../User/User";
import { MessageComposer } from "../MessageComposer/MessageComposer";

interface IRoomProps extends RouteComponentProps {
  name: string;
}

export const Room: FunctionComponent<IRoomProps> = observer(({ name }: IRoomProps) => {
  const pixlyStore = useStore("pixlyStore");
  const roomContentElRef = useRef(null);
  const zeroPointElRef = useRef<HTMLDivElement>(null);
  const authenticatedUserElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pixlyStore.joinRoom({
      name,
    });
  }, []);

  const onRoomClick = ({ clientX, clientY }: React.MouseEvent<HTMLElement>) => {
    const zeroPointBoundingRect = zeroPointElRef.current?.getBoundingClientRect();
    if (zeroPointBoundingRect) {
      const zeroPointXDistance = clientX - zeroPointBoundingRect?.x;
      const zeroPointYDistance = (clientY - zeroPointBoundingRect?.y) * -1;

      pixlyStore.updateStatus({
        x: zeroPointXDistance,
        y: zeroPointYDistance,
      });
    }
  };

  return (
    <div className="Room">
      <div className="nes-container with-title is-centered RoomBoundary">
        <p className="title">{name} room</p>
        {pixlyStore.room ? (
          <>
            <div className="RoomContent" ref={roomContentElRef} onClick={onRoomClick}>
              <div className="RoomContentZeroPoint" ref={zeroPointElRef}>
                {Object.entries(pixlyStore.room.users).map(([userSocketId, user]) => {
                  const positioningStyles: CSSProperties = {
                    left: user.status?.x || 0 * -1 || 0,
                    bottom: user.status?.y || 0 * -1,
                    position: "absolute",
                  };

                  return (
                    <div
                      key={`${userSocketId}${pixlyStore.user?.status?.x}${pixlyStore.user?.status?.y}`}
                      style={positioningStyles}
                      ref={userSocketId === pixlyStore.user?.socketId ? authenticatedUserElRef : undefined}
                    >
                      <User
                        user={user}
                        style={{ transform: `translateX(-50%) translateY(-50%)` }}
                        authenticatedUserElRef={authenticatedUserElRef.current}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <MessageComposer />
          </>
        ) : (
          <div className="RoomContent">
            <h1>Joining room...</h1>
          </div>
        )}
      </div>
    </div>
  );
});
