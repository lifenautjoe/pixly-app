import { PixlyProtocol } from "../core/protocol";
import React, { FunctionComponent } from "react";

const avatarIdsToClassesMap: { [avatarId: string]: string } = {};

avatarIdsToClassesMap[PixlyProtocol.avatars.BULBASAUR] = "nes-bulbasaur";

avatarIdsToClassesMap[PixlyProtocol.avatars.CHARMANDER] = "nes-charmander";

avatarIdsToClassesMap[PixlyProtocol.avatars.SQUIRTLE] = "nes-squirtle";

interface AvatarProps {
  avatarId: string;
}

export const Avatar: FunctionComponent<AvatarProps> = ({ avatarId }: AvatarProps) => {
  return <i className={avatarIdsToClassesMap[avatarId]}></i>;
};
