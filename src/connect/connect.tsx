import { Card, Spinner } from "@blueprintjs/core";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CONNECTION_SPEC_LS_KEY, LOCAL_INFO_LS_KEY } from "../parent";
import { useNavigate } from "react-router-dom";
import { ConnectionSpecification } from "../types/context-types";
import { LocalInfoHost, LocalInfoTaster } from "../types/local-info-types";
import {
  getFreshLocalInfoHost,
  getFreshLocalInfoTaster,
  getWords,
} from "../utils/generic-utils";
import { v4 as uuidv4 } from "uuid";

export const Connect = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState<"LOADING" | "FAILURE">("LOADING");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const connectSpec = useMemo((): ConnectionSpecification | null => {
    const roomId = queryParams.get("roomId");
    const roomPwd = queryParams.get("roomPwd");
    const localId = queryParams.get("localId");
    const localPwd = queryParams.get("localPwd");
    if (
      roomId == null ||
      roomPwd == null ||
      localId == null ||
      localPwd == null
    ) {
      return null;
    }
    const roomSpec: ConnectionSpecification = {
      roomId,
      roomPwd,
      localId,
      localPwd,
    };
    return roomSpec;
  }, [queryParams]);

  useEffect(() => {
    const isHost = queryParams.get("isHost");
    if (connectSpec == null) {
      console.log("Invalid connection details", connectSpec);
      setStatus("FAILURE");
    } else {
      localStorage.setItem(CONNECTION_SPEC_LS_KEY, JSON.stringify(connectSpec));
      if (isHost) {
        localStorage.setItem(
          LOCAL_INFO_LS_KEY,
          JSON.stringify(getFreshLocalInfoHost())
        );
        navigate("/create-tasting");
      } else {
        localStorage.setItem(
          LOCAL_INFO_LS_KEY,
          JSON.stringify(getFreshLocalInfoTaster())
        );
        navigate("/taster-info");
      }
    }
  }, []);

  switch (status) {
    case "LOADING":
      return (
        <Card className={"center"}>
          <h3>Connecting...</h3>
          <Spinner size={100} />
          <br></br>
          <div>To wine tasting</div>
        </Card>
      );
    case "FAILURE":
      return (
        <Card className={"center"}>
          <h3>Invalid connection parameters</h3>
          <div>Try again</div>
        </Card>
      );
    default:
      return null;
  }
};
