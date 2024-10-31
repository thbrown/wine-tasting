import { LocalInfoTaster } from "./local-info-types";
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
  wines: Wine[];
}

export interface ClientPushLocalInfo {
  type: "clientPushInfo";
  info: LocalInfoTaster;
}
export interface HostResponseLocalInfo {
  type: "hostResponseLocalInfo";
}

export interface ClientPushResults {
  type: "clientPushResults";
  results: LocalInfoTaster[];
}
export interface HostResponseResults {
  type: "hostResponseResults";
}
