import React, { ReactNode, useEffect, useRef, useState } from "react";

import "./Routes.scss";
import { joinRoom, Room } from "trystero/firebase";
import { ParentConnected } from "./parent-connected";
import {
  LocalInfo,
  LocalInfoHost,
  LocalInfoTaster,
  Wine,
} from "./types/local-info-types";
import { createNewHostRoom, getWords, toUrlPath } from "./utils/generic-utils";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import {
  ConnectionSpecification,
  OutletContextBase,
} from "./types/context-types";
import { ConnectingCard } from "./shared-components/connecting-card";

const APP_ID = process.env.REACT_APP_APP_ID || "default_value";
export const CONNECTION_SPEC_LS_KEY = "connectionSpec";
export const LOCAL_INFO_LS_KEY = "localInfo";

const getConnectionSpecFromStorage = () => {
  const stored = localStorage.getItem(CONNECTION_SPEC_LS_KEY);
  console.log("Got connection spec from storage", stored);
  return stored ? JSON.parse(stored) : null;
};

const getLocalInfoFromStorage = (): LocalInfo => {
  const stored = localStorage.getItem(LOCAL_INFO_LS_KEY);
  console.log("Got local inf from storage", stored);

  if (stored) {
    return JSON.parse(stored) as LocalInfo;
  } else {
    return { type: "none" };
  }
};

export const Parent = () => {
  const navigate = useNavigate();

  const [connectionSpec, setConnectionSpec] =
    useState<ConnectionSpecification | null>(getConnectionSpecFromStorage());
  const [room, setRoom] = useState<Room | null>(null);
  const [localInfo, setLocalInfo] = useState<LocalInfo>(
    getLocalInfoFromStorage()
  );
  const [localStorageLoadComplete, setLocalStorageLoadComplete] =
    useState<boolean>(false);

  // Keep local storage in sync with state
  useEffect(() => {
    localStorage.setItem(
      CONNECTION_SPEC_LS_KEY,
      JSON.stringify(connectionSpec)
    );
  }, [connectionSpec]);

  useEffect(() => {
    console.log("Setting local info", JSON.stringify(localInfo));
    localStorage.setItem(LOCAL_INFO_LS_KEY, JSON.stringify(localInfo));
  }, [localInfo]);

  // On load, restore data from local storage
  useEffect(() => {
    if (connectionSpec != null) {
      switchRoom(connectionSpec);
      setLocalInfo(localInfo);
      setLocalStorageLoadComplete(true);
    } else {
      // Need to go to connect page first
      const newRoom = createNewHostRoom();
      const newRoomUrl = toUrlPath(newRoom, true);
      navigate(newRoomUrl);
    }
  }, []);

  const switchRoom = (newConnectionSpec: ConnectionSpecification) => {
    console.log(
      "Switching to room",
      newConnectionSpec.roomId,
      newConnectionSpec.roomPwd,
      APP_ID
    );
    if (room != null) {
      room.leave();
    }
    const newRoom = joinRoom(
      { appId: APP_ID, password: newConnectionSpec.roomPwd },
      newConnectionSpec.roomId
    );
    newRoom.onPeerJoin((peerId) => {
      console.log("Peer joined", peerId);
    });
    newRoom.onPeerLeave((peerId) => {
      console.log("Peer left", peerId);
    });
    setRoom(newRoom);
    setConnectionSpec(newConnectionSpec);
    return newRoom;
  };

  if (
    localStorageLoadComplete === false ||
    room == null ||
    connectionSpec == null
  ) {
    return <ConnectingCard />;
  } else {
    const partialContext: OutletContextBase = {
      switchRoom,
      setLocalInfo,
      connectionSpec,
      room,
      localInfo,
    };
    return <ParentConnected baseContext={partialContext} />;
  }
};
