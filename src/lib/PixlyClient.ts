import { io, Socket } from "socket.io-client";
import { PixlyProtocol } from "../core/protocol";
import { IAuthenticatedEventData } from "../core/interfaces/event-data/IAuthenticatedEventData";
import { IJoinedRoomEventData } from "../core/interfaces/event-data/IJoinedRoomEventData";
import { INewMessageEventData } from "../core/interfaces/event-data/INewMessageEventData";
import { IRoomUpdateEventData } from "../core/interfaces/event-data/IRoomUpdateEventData";
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
  onConnected?: (socket: Socket) => void;
  onAuthenticated: (socket: Socket, eventData: IAuthenticatedEventData) => void;
  onJoinedRoom: (socket: Socket, eventData: IJoinedRoomEventData) => void;
  onNewMessage: (socket: Socket, eventData: INewMessageEventData) => void;
  onRoomStatusUpdate: (socket: Socket, eventData: IRoomUpdateEventData) => void;
  onUserStatusUpdate: (socket: Socket, eventData: IUserStatusUpdateEventData) => void;
  onUserLeftRoom: (socket: Socket, eventData: IUserLeftRoomEventData) => void;
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

    this.socket = io(this.config.endpoint);
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

  public validateAuthenticateActionDto(rawData: Record<string, unknown>): ValidationError[] {
    return this.validateData(rawData, AuthenticateActionDto);
  }

  public emitAuthenticateAction(dto: AuthenticateActionDto): void {
    this.socket?.emit(PixlyProtocol.actions.AUTHENTICATE, dto);
  }

  public validateJoinRoomActionDto(rawData: Record<string, unknown>): ValidationError[] {
    return this.validateData(rawData, JoinRoomActionDto);
  }

  public emitJoinRoomAction(dto: JoinRoomActionDto): void {
    this.socket?.emit(PixlyProtocol.actions.JOIN_ROOM, dto);
  }

  public validateSendMessageActionDto(rawData: Record<string, unknown>): ValidationError[] {
    return this.validateData(rawData, SendMessageActionDto);
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

  private onSocketConnect(socket: Socket) {
    if (this.config.onConnected) {
      this.config.onConnected(socket);
    }
    this.installEvents(socket);
  }

  private installEvents(socket: Socket) {
    socket.on(PixlyProtocol.events.AUTHENTICATED, this.config.onAuthenticated);

    socket.on(PixlyProtocol.events.JOINED_ROOM, this.config.onJoinedRoom);

    socket.on(PixlyProtocol.events.NEW_MESSAGE, this.config.onNewMessage);

    socket.on(PixlyProtocol.events.ROOM_STATUS_UPDATE, this.config.onRoomStatusUpdate);

    socket.on(PixlyProtocol.events.USER_STATUS_UPDATE, this.config.onUserStatusUpdate);

    socket.on(PixlyProtocol.events.USER_LEFT_ROOM, this.config.onUserLeftRoom);
  }

  private validateData<DtoClass>(rawData: Record<string, unknown>, dto: any): ValidationError[] {
    const data = (plainToClass(dto, rawData) as unknown) as DtoClass;
    return validateSync(data);
  }
}
