import { LocalInfoTaster, WineTasting } from "./local-info-types";
import { Wine } from "./local-info-types";

// TODO: for proper security we'd want to use some form of message encryption so the host can't be faked by clients

export type BaseMessage = {
  target: "host" | string;
  source: string;
  id: string;
  data:
    | ClientRequestConnection
    | HostResponseConnection
    | ClientPushLocalInfo
    | HostResponseLocalInfo;
} & (Response | Request);

export interface Response {
  direction: "response";
  requestMessageId: string;
}

export interface Request {
  direction: "request";
}

export interface ClientRequestConnection {
  type: "clientRequestConnection";
}
export interface HostResponseConnection {
  type: "hostResponseConnection";
  wines: Record<string, Wine>;
}

export interface ClientPushLocalInfo {
  type: "clientPushInfo";
  info: LocalInfoTaster;
  nextPage: string | null;
}
export interface HostResponseLocalInfo {
  type: "hostResponseLocalInfo";
  nextPage: string | null;
}

/*
export interface ClientPushTastings {
  type: "clientPushTastings";
  tastings: WineTasting[];
}
export interface HostResponseTastings {
  type: "hostResponseTastings";
}
*/
