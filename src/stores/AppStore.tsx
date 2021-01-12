import { Socket } from "socket.io-client";
import { IAuthenticatedEventData } from "../core/interfaces/event-data/IAuthenticatedEventData";
import { IJoinedRoomEventData } from "../core/interfaces/event-data/IJoinedRoomEventData";
import { INewMessageEventData } from "../core/interfaces/event-data/INewMessageEventData";
import { IRoomUpdateEventData } from "../core/interfaces/event-data/IRoomUpdateEventData";
import { IUserStatusUpdateEventData } from "../core/interfaces/event-data/UserUpdateEventData";
import { IUserLeftRoomEventData } from "../core/interfaces/event-data/IUserLeftRoomEventData";
import { PixlyClient } from "../lib/PixlyClient";
import { computed, observable } from "mobx";
import { IUserData } from "../core/interfaces/model-data/IUserData";
import { IRoomData } from "../core/interfaces/model-data/IRoomData";
import { IMessageData } from "../core/interfaces/model-data/IMessageData";
import { ValidationError } from "class-validator";

export class AppStore {
  pixlyClient: PixlyClient;

  @observable
  user?: IUserData;

  @observable
  room?: IRoomData;

  @observable
  messages?: IMessageData[];

  constructor({ pixlyEndpoint }: { pixlyEndpoint: string }) {
    this.pixlyClient = new PixlyClient({
      endpoint: pixlyEndpoint,
      onAuthenticated: this.onPixlyAuthenticated,
      onJoinedRoom: this.onPixlyJoinedRoom,
      onNewMessage: this.onPixlyNewMessage,
      onRoomStatusUpdate: this.onPixlyRoomStatusUpdate,
      onUserStatusUpdate: this.onPixlyUserStatusUpdate,
      onUserLeftRoom: this.onPixlyUserLeftRoom,
    });
  }

  @computed
  get isAuthenticated(): boolean {
    return typeof this.user !== "undefined";
  }

  public startPixly(): void {
    if (this.pixlyClient?.started) return;
    this.pixlyClient?.start();
  }

  public validateUserAuthenticationData(name: string, avatar: string): ValidationError[] {
    return this.pixlyClient.validateAuthenticateActionDto({
      name,
      avatar,
    });
  }

  private onPixlyAuthenticated(socket: Socket, eventData: IAuthenticatedEventData) {
    console.log("🐵 User authenticated with data", eventData);
  }

  private onPixlyJoinedRoom(socket: Socket, eventData: IJoinedRoomEventData) {
    console.log("🏡 Joined room with data", eventData);
  }

  private onPixlyNewMessage(socket: Socket, eventData: INewMessageEventData) {
    console.log("💌 New message with data", eventData);
  }

  private onPixlyRoomStatusUpdate(socket: Socket, eventData: IRoomUpdateEventData) {
    console.log("📍 Room status update with data", eventData);
  }

  private onPixlyUserStatusUpdate(socket: Socket, eventData: IUserStatusUpdateEventData) {
    console.log("📍 User status update with data", eventData);
  }

  private onPixlyUserLeftRoom(socket: Socket, eventData: IUserLeftRoomEventData) {
    console.log("👋 User left room with data", eventData);
  }
}
