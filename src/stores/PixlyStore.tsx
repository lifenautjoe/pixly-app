import { IAuthenticatedEventData } from "../core/interfaces/event-data/IAuthenticatedEventData";
import { IJoinedRoomEventData } from "../core/interfaces/event-data/IJoinedRoomEventData";
import { INewMessageEventData } from "../core/interfaces/event-data/INewMessageEventData";
import { IUserStatusUpdateEventData } from "../core/interfaces/event-data/UserUpdateEventData";
import { IUserLeftRoomEventData } from "../core/interfaces/event-data/IUserLeftRoomEventData";
import { PixlyClient } from "../lib/PixlyClient";
import { makeAutoObservable } from "mobx";
import { IUserData } from "../core/interfaces/model-data/IUserData";
import { IRoomData } from "../core/interfaces/model-data/IRoomData";
import { IMessageData } from "../core/interfaces/model-data/IMessageData";
import { ValidationError } from "class-validator";
import { AuthenticateActionDto } from "../core/dtos/AuthenticateActionDto";
import { JoinRoomActionDto } from "../core/dtos/JoinRoomActionDto";
import { SendMessageActionDto } from "../core/dtos/SendMessageActionDto";
import { UpdateStatusActionDto } from "../core/dtos/UpdateStatusActionDto";
import { IUserStatusData } from "../core/interfaces/model-data/IUserStatusData";
import { IUserJoinedRoomEventData } from "../core/interfaces/event-data/IUserJoinedRoomEventData";

export class PixlyStore {
  static readonly MESSAGE_KEEPALIVE_IN_MS = 3000;

  client: PixlyClient;

  user?: IUserData;

  room?: IRoomData;

  // Please note any user may only have one message they own in this array.
  messages: IMessageData[] = [];

  errorMessage = "";

  fatalErrorMessage = "";

  connected = false;

  constructor({ endpoint }: { endpoint: string }) {
    this.client = new PixlyClient({
      endpoint: endpoint,
      onAuthenticated: this.onAuthenticated,
      onJoinedRoom: this.onJoinedRoom,
      onNewMessage: this.onNewMessage,
      onUserStatusUpdate: this.onUserStatusUpdate,
      onUserLeftRoom: this.onUserLeftRoom,
      onUserJoinedRoom: this.onUserJoinedRoom,
      onError: this.onError,
      onConnected: this.onConnected,
      onDisconnected: this.onDisconnected,
    });

    makeAutoObservable(this);
  }

  public connect(): void {
    // TODO Handle tear-down
    if (this.client?.started) return;
    this.client?.start();
  }

  public clearErrorMessage(): void {
    this.setErrorMessage("");
  }

  get isAuthenticated(): boolean {
    return typeof this.user !== "undefined";
  }

  public getUserLatestMessage(user: IUserData): IMessageData | undefined {
    return this.messages.find(message => message.user.socketId === user.socketId);
  }

  public validateUserAuthenticationDto(dto: AuthenticateActionDto): ValidationError[] {
    return this.client.validateAuthenticateActionDto(dto);
  }

  public authenticate(dto: AuthenticateActionDto): void {
    this.client.emitAuthenticateAction(dto);
  }

  public joinRoom(dto: JoinRoomActionDto): void {
    this.client.emitJoinRoomAction(dto);
  }

  public validateSendMessageActionDto(dto: SendMessageActionDto): ValidationError[] {
    return this.client.validateSendMessageActionDto(dto);
  }

  public sendMessage(dto: SendMessageActionDto): void {
    if (!this.user) return;
    const message: IMessageData = {
      user: this.user,
      text: dto.text,
    };

    // Add it locally
    this.onNewMessage({
      message,
    });

    this.client.emitSendMessageAction(dto);
  }

  public updateStatus(dto: UpdateStatusActionDto): void {
    this.updateLocalStatus(dto);
    this.client.emitUpdateStatusAction(dto);
  }

  private onAuthenticated = (eventData: IAuthenticatedEventData) => {
    console.log("🐵 User authenticated with data", eventData);
    this.setUser(eventData.user);
  };

  private onJoinedRoom = (eventData: IJoinedRoomEventData) => {
    console.log("🏡 Joined room with data", eventData);
    this.setRoom(eventData.room);
  };

  private onNewMessage = (eventData: INewMessageEventData) => {
    console.log("💌 New message with data", eventData);

    const message = eventData.message;
    this.addNewMessage(message);
    setTimeout(() => {
      this.removeMessageByReference(message);
    }, PixlyStore.MESSAGE_KEEPALIVE_IN_MS);
  };

  private onUserStatusUpdate = (eventData: IUserStatusUpdateEventData) => {
    console.log("📍 User status update with data", eventData);
    this.updateUserInRoom(eventData.user);
  };

  private onUserLeftRoom = (eventData: IUserLeftRoomEventData) => {
    console.log("👋 User left room with data", eventData);
    this.removeUserWithSocketIdFromRoom(eventData.user.socketId);
  };

  private onUserJoinedRoom = (eventData: IUserJoinedRoomEventData) => {
    console.log("🚀 User joined room with data", eventData);
    this.addUserToRoom(eventData.user);
  };

  private onConnected = () => {
    console.log(`🔌 Connected`);
    this.setConnected(true);
  };

  private onDisconnected = () => {
    console.log("🔌 Disconnected");
    this.setConnected(false);
    this.setFatalErrorMessage("Connection was lost");
  };

  private onError = (error: Error) => {
    console.log("🔥 Error", error);
    if (this.connected) {
      this.setErrorMessage(error.message);
    } else {
      this.setFatalErrorMessage(error.message);
    }
  };

  private setUser(user: IUserData) {
    this.user = user;
  }

  private setRoom(room: IRoomData) {
    this.room = room;
  }

  private addNewMessage(message: IMessageData) {
    this.messages?.unshift(message);
  }

  private removeMessageByReference(message: IMessageData) {
    const indexOfMessage = this.messages.indexOf(message);
    this.messages.splice(indexOfMessage, 1);
  }

  private updateUserInRoom(user: IUserData) {
    if (user.socketId) {
      const storedUser = this.getUserWithSocketIdFromRoom(user.socketId);
      if (storedUser) {
        storedUser.status = user.status;
      }
    }
  }

  private addUserToRoom(user: IUserData) {
    if (this.room) {
      this.room.users[user.socketId] = user;
    }
  }

  private removeUserWithSocketIdFromRoom(socketId: string) {
    if (this.room?.users) {
      delete this.room.users[socketId];
    }
  }

  private getUserWithSocketIdFromRoom(socketId: string) {
    if (this.room?.users) {
      return this.room?.users[socketId];
    }
  }

  private updateLocalStatus(status: IUserStatusData): void {
    if (this.user) {
      const roomUser = this.getUserWithSocketIdFromRoom(this.user?.socketId);
      if (roomUser) {
        roomUser.status = status;
      }
    }
  }

  private setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  private setFatalErrorMessage(errorMessage: string) {
    this.fatalErrorMessage = errorMessage;
  }

  private setConnected(connected: boolean) {
    this.connected = connected;
  }
}
