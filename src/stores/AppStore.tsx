import { Socket } from "socket.io-client";
import { IAuthenticatedEventData } from "../core/interfaces/event-data/IAuthenticatedEventData";
import { IJoinedRoomEventData } from "../core/interfaces/event-data/IJoinedRoomEventData";
import { INewMessageEventData } from "../core/interfaces/event-data/INewMessageEventData";
import { IRoomUpdateEventData } from "../core/interfaces/event-data/IRoomUpdateEventData";
import { IUserStatusUpdateEventData } from "../core/interfaces/event-data/UserUpdateEventData";
import { IUserLeftRoomEventData } from "../core/interfaces/event-data/IUserLeftRoomEventData";
import { PixlyClient } from "../lib/PixlyClient";

export class AppStore {
  pixlyClient?: PixlyClient;

  constructor() {
    this.pixlyClient = new PixlyClient({
      endpoint: "http://localhost:9000",
      onAuthenticated: this.onPixlyAuthenticated,
      onJoinedRoom: this.onPixlyJoinedRoom,
      onNewMessage: this.onPixlyNewMessage,
      onRoomStatusUpdate: this.onPixlyRoomStatusUpdate,
      onUserStatusUpdate: this.onPixlyUserStatusUpdate,
      onUserLeftRoom: this.onPixlyUserLeftRoom,
    });
  }

  public startPixly(): void {
    this.pixlyClient?.start();
  }

  private onPixlyAuthenticated(socket: Socket, eventData: IAuthenticatedEventData) {}

  private onPixlyJoinedRoom(socket: Socket, eventData: IJoinedRoomEventData) {}

  private onPixlyNewMessage(socket: Socket, eventData: INewMessageEventData) {}

  private onPixlyRoomStatusUpdate(socket: Socket, eventData: IRoomUpdateEventData) {}

  private onPixlyUserStatusUpdate(socket: Socket, eventData: IUserStatusUpdateEventData) {}

  private onPixlyUserLeftRoom(socket: Socket, eventData: IUserLeftRoomEventData) {}
}
