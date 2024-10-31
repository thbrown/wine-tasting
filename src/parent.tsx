import React, { ReactNode, useEffect, useRef, useState } from "react";

import "./Routes.scss";
import { joinRoom, Room } from "trystero/firebase";
import { ParentConnected } from "./parent-connected";
import { LocalInfo, Wine } from "./types/local-info-types";
import { createNewRoom, getWords, toUrlPath } from "./utils/generic-utils";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import {
  ConnectionSpecification,
  OutletContextBase,
} from "./types/context-types";
import { ConnectingCard } from "./shared-components/connecting-card";
import { v4 as uuidv4 } from "uuid";

const APP_ID = process.env.REACT_APP_APP_ID || "default_value";
export const CONNECTION_SPEC_LS_KEY = "connectionSpec";
const LOCAL_INFO_LS_KEY = "localInfo";

const getConnectionSpecFromStorage = () => {
  const stored = localStorage.getItem(CONNECTION_SPEC_LS_KEY);
  return stored ? JSON.parse(stored) : null;
};

const getLocalInfoFromStorage = () => {
  if (useLocation().pathname === "/connect") {
    return { type: "host" };
  }
  const stored = localStorage.getItem(LOCAL_INFO_LS_KEY);
  return stored
    ? JSON.parse(stored)
    : {
        type: "host",
        qrId: getWords(3),
        qrPwd: uuidv4(),
      };
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
    localStorage.setItem(LOCAL_INFO_LS_KEY, JSON.stringify(localInfo));
  }, [localInfo]);

  // On load, restore data from local storage
  useEffect(() => {
    if (connectionSpec != null) {
      switchRoom(connectionSpec);
      setLocalInfo(localInfo);
      setLocalStorageLoadComplete(true);
    }
  }, []);

  useEffect(() => {
    if (connectionSpec == null) {
      const newRoom = createNewRoom();
      const newRoomUrl = toUrlPath(newRoom);
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
