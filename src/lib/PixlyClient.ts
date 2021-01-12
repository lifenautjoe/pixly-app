import { IUserJoinedRoomEventData } from "./../core/interfaces/event-data/IUserJoinedRoomEventData";
import { io, Socket } from "socket.io-client";
import { PixlyProtocol } from "../core/protocol";
import { IAuthenticatedEventData } from "../core/interfaces/event-data/IAuthenticatedEventData";
import { IJoinedRoomEventData } from "../core/interfaces/event-data/IJoinedRoomEventData";
import { INewMessageEventData } from "../core/interfaces/event-data/INewMessageEventData";
import { IUserStatusUpdateEventData } from "../core/interfaces/event-data/UserUpdateEventData";
import { IUserLeftRoomEventData } from "../core/interfaces/event-data/IUserLeftRoomEventData";
import { AuthenticateActionDto } from "../core/dtos/AuthenticateActionDto";
import { JoinRoomActionDto } from "../core/dtos/JoinRoomActionDto";
import { SendMessageActionDto } from "../core/dtos/SendMessageActionDto";
import { UpdateStatusActionDto } from "../core/dtos/UpdateStatusActionDto";
import { plainToClass } from "class-transformer";
import { validateSync, ValidationError } from "class-validator";

interface PixlyClientConfig {
  endpoint: string;
  onConnected?: () => void;
  onAuthenticated: (eventData: IAuthenticatedEventData) => void;
  onJoinedRoom: (eventData: IJoinedRoomEventData) => void;
  onNewMessage: (eventData: INewMessageEventData) => void;
  onUserStatusUpdate: (eventData: IUserStatusUpdateEventData) => void;
  onUserLeftRoom: (eventData: IUserLeftRoomEventData) => void;
  onUserJoinedRoom: (eventData: IUserJoinedRoomEventData) => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

export class PixlyClient {
  socket?: Socket;

  started = false;

  constructor(private config: PixlyClientConfig) {}

  public start(): void {
    if (this.started) {
      throw new Error("PixlyClient is already started");
    }

    this.socket = io(this.config.endpoint, { secure: false, reconnection: false, rejectUnauthorized: false });
    this.socket.on("connect", this.onSocketConnect);

    if (this.config.onError) {
      this.socket.on("connect_error", this.config.onError);
      this.socket.on("connect_failed", this.config.onError);
    }

    if (this.config.onDisconnected) {
      this.socket.on("disconnect", this.config.onDisconnected);
    }

    this.started = true;
  }

  public validateAuthenticateActionDto(dto: AuthenticateActionDto): ValidationError[] {
    return this.validateData(dto, AuthenticateActionDto);
  }

  public emitAuthenticateAction(dto: AuthenticateActionDto): void {
    this.socket?.emit(PixlyProtocol.actions.AUTHENTICATE, dto);
  }

  public validateJoinRoomActionDto(dto: JoinRoomActionDto): ValidationError[] {
    return this.validateData(dto, JoinRoomActionDto);
  }

  public emitJoinRoomAction(dto: JoinRoomActionDto): void {
    this.socket?.emit(PixlyProtocol.actions.JOIN_ROOM, dto);
  }

  public validateSendMessageActionDto(dto: SendMessageActionDto): ValidationError[] {
    return this.validateData(dto, SendMessageActionDto);
  }

  public emitSendMessageAction(dto: SendMessageActionDto): void {
    this.socket?.emit(PixlyProtocol.actions.SEND_MESSAGE, dto);
  }

  public validateUpdateStatusActionDto(rawData: Record<string, unknown>): ValidationError[] {
    return this.validateData(rawData, UpdateStatusActionDto);
  }

  public emitUpdateStatusAction(dto: UpdateStatusActionDto): void {
    this.socket?.emit(PixlyProtocol.actions.UPDATE_STATUS, dto);
  }

  private onSocketConnect = () => {
    if (this.config.onConnected) {
      this.config.onConnected();
    }
    this.installEvents();
  };

  private installEvents() {
    if (this.socket) {
      this.socket.on(PixlyProtocol.events.AUTHENTICATED, this.config.onAuthenticated);

      this.socket.on(PixlyProtocol.events.JOINED_ROOM, this.config.onJoinedRoom);

      this.socket.on(PixlyProtocol.events.NEW_MESSAGE, this.config.onNewMessage);

      this.socket.on(PixlyProtocol.events.USER_STATUS_UPDATE, this.config.onUserStatusUpdate);

      this.socket.on(PixlyProtocol.events.USER_LEFT_ROOM, this.config.onUserLeftRoom);

      this.socket.on(PixlyProtocol.events.USER_JOINED_ROOM, this.config.onUserJoinedRoom);
    }
  }

  private validateData<DtoClass>(rawData: any, dto: any): ValidationError[] {
    const data = (plainToClass(dto, rawData) as unknown) as DtoClass;
    return validateSync(data);
  }
}
