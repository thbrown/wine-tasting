import { Room } from "trystero";
import { LocalInfo } from "./local-info-types";
import { BaseMessage } from "./message-types";

export type ConnectionSpecification = {
  roomId: string;
  roomPwd: string;
  localId: string;
  localPwd: string;
};

export type OutletContextBase = {
  connectionSpec: ConnectionSpecification;
  room: Room;
  localInfo: LocalInfo;

  switchRoom: (spec: ConnectionSpecification, isHost: boolean) => void;
  setLocalInfo: (info: LocalInfo) => void;
};

export type OutletContextConnected = {
  sendMessage: (message: BaseMessage) => void;
  clearTimers: () => void;
} & OutletContextBase;
