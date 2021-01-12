import { PixlyProtocol } from "../../core/protocol";
import React, { FunctionComponent, useRef } from "react";
import "./AvatarPicker.scss";
import { Avatar } from "../Avatar";

interface AvatarPickerProps {
  onPickedAvatar: (avatar: string) => void;
  pickedAvatar: string;
}

export const AvatarPicker: FunctionComponent<AvatarPickerProps> = ({ onPickedAvatar, pickedAvatar }: AvatarPickerProps) => {
  const avatarIds = useRef(Object.values(PixlyProtocol.avatars));

  return (
    <div className="AvatarPicker">
      {avatarIds.current.map(avatarId => (
        <div
          className={`nes-container AvatarPickerAvatar ${avatarId === pickedAvatar ? "is-dark" : ""}`}
          key={avatarId}
          onClick={() => onPickedAvatar(avatarId)}
        >
          <Avatar avatarId={avatarId} />
        </div>
      ))}
    </div>
  );
};
