import React, { ReactNode, useEffect, useRef, useState } from "react";

import "./Routes.scss";
import { Outlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BaseMessage } from "./types/message-types";
import { Card, Spinner } from "@blueprintjs/core";
import { useLocation } from "react-router-dom";
import { assertNever, getWords } from "./utils/generic-utils";
import {
  OutletContextBase,
  OutletContextConnected,
} from "./types/context-types";
import { ConnectingCard } from "./shared-components/connecting-card";

const QUEUED_MESSAGES_LS_KEY = "messagesToSend";

const getQueuedMessagesFromStorage = () => {
  const stored = localStorage.getItem(QUEUED_MESSAGES_LS_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const ParentConnected = (props: { baseContext: OutletContextBase }) => {
  const [sendMessageRaw, getMessage] =
    props.baseContext.room.makeAction<BaseMessage>("message");

  // We have a message queue and timer for each connected device we can send messages to
  const timers = useRef<{ [key: string]: NodeJS.Timeout | undefined }>({});
  const [messagesToSend, setMessagesToSend] = useState<{
    [targetId: string]: BaseMessage[];
  }>(getQueuedMessagesFromStorage());

  const [confirmedConnectedLocalId, setConfirmedConnectedLocalId] = useState<
    string | null
  >();

  useEffect(() => {
    for (const key in messagesToSend) {
      kickQueue(key);
    }

    return () => {
      console.log("Clearing all timers");
    };
  });

  // Keep message queue in sync with ls
  useEffect(() => {
    localStorage.setItem(
      QUEUED_MESSAGES_LS_KEY,
      JSON.stringify(messagesToSend)
    );
  }, [messagesToSend]);

  const clearTimers = () => {
    for (const key in timers.current || []) {
      clearInterval(timers.current[key]);
      timers.current[key] = undefined;
    }
  };

  const sendMessage = (message: BaseMessage) => {
    console.log("Sending message", message);
    if (message.direction === "request") {
      enqueueMessage(message);
      return;
    } else if (message.direction === "response") {
      sendMessageRaw(message);
      return;
    } else {
      assertNever(message);
    }
  };

  const enqueueMessage = (message: BaseMessage) => {
    const targetId = message.target;
    setMessagesToSend((prevMessages) => ({
      ...prevMessages,
      [targetId]: [...(prevMessages[targetId] || []), message],
    }));
    kickQueue(targetId);
  };

  /*
      if (context.connectionStatus === "disconnected") {
        console.log("All connection details provided", connectSpec);
        switchRoom(connectSpec, false);
      } else {
        if (context.connectionSpec.localId !== localId) {
          context.clearTimers();
          context.switchRoom(connectSpec, false);
        }
        context.sendMessage({
          id: uuidv4(),
          target: "host",
          source: localId,
          direction: "request",
          data: {
            type: "clientRequestConnection",
          },
        });
        navigate("/taste-info");
      }
        */

  /**
   * Send a message to the targetId if there is a message queued and if there is not already a message being sent
   * @param targetId
   */
  const kickQueue = (targetId: string) => {
    if (
      messagesToSend[targetId] != null &&
      messagesToSend[targetId].length >= 1 &&
      timers.current[targetId] == null
    ) {
      const nextMessageToSend = messagesToSend[targetId][0];
      const targetTimer = timers.current[targetId];
      if (targetTimer == null) {
        timers.current[targetId] = setInterval(() => {
          console.log("Sending message", nextMessageToSend);
          sendMessageRaw(nextMessageToSend);
        }, 1000);
      } else {
        console.warn(
          "No messages in queue but timer is set",
          messagesToSend[targetId],
          timers.current[targetId]
        );
      }
    }
  };

  getMessage((msg) => {
    if (msg.source === props.baseContext.connectionSpec.localId) {
      return;
    }
    console.log("Received message!", msg.data.type, msg);

    // Remove a message from the send queue if the requestMessageId matches the 1st message in the queue
    // This indicates the message is a response to a message we sent (and we don't need to send it again)
    if (
      msg.direction === "response" &&
      messagesToSend[msg.source].length > 0 &&
      messagesToSend[msg.source][0].id === msg.requestMessageId
    ) {
      messagesToSend[msg.source].shift();
      clearInterval(timers.current[msg.source]);
      timers.current[msg.source] = undefined;
    }

    if (msg.target === props.baseContext.connectionSpec.localId) {
      if (props.baseContext.localInfo.type === "host") {
        if (msg.data.type === "clientRequestConnection") {
          if (props.baseContext.localInfo.qrId === msg.source) {
            maybeUpdateQrCode();
          }
          // TODO: update taster list
          console.log("Host sending message to", msg.source);
          sendMessage({
            id: uuidv4(),
            target: msg.source,
            source: props.baseContext.connectionSpec.localId,
            direction: "response",
            requestMessageId: msg.id,
            data: {
              type: "hostResponseConnection",
              wines: props.baseContext.localInfo.wines,
            },
          });
          return;
        } else {
          console.warn("Host got unhandled message", msg.data.type, msg);
        }
      } else if (props.baseContext.localInfo.type === "taster") {
        if (msg.data.type === "hostResponseConnection") {
          console.log(
            "hostResponseConnection",
            props.baseContext.connectionSpec.localId
          );
          setConfirmedConnectedLocalId(
            props.baseContext.connectionSpec.localId
          );
          setLocalInfo({
            ...props.baseContext.localInfo,
            winesToTaste: msg.data.wines,
          });
          return;
        } else {
          console.warn("Non-host got unhandled message", msg.data.type, msg);
        }
      }
    } else {
      console.warn(
        "This message is not for me (I will ignore)",
        msg.target,
        msg
      );
    }
  });
  const [qrId, setQrId] = useState<string>(getWords(3));
  const [qrPwd, setQrPwd] = useState<string>(uuidv4());

  const maybeUpdateQrCode = () => {
    if (props.baseContext.localInfo.type === "host") {
      setLocalInfo({
        ...props.baseContext.localInfo,
        qrId: getWords(3),
        qrPwd: uuidv4(),
      });
    }
  };

  const fullContext: OutletContextConnected = {
    ...props.baseContext,
    sendMessage,
    clearTimers,
  };

  const isHost = props.baseContext.localInfo.type === "host";
  const isConnectionConfirmed =
    confirmedConnectedLocalId === props.baseContext.connectionSpec.localId;

  if (!isConnectionConfirmed && !isHost) {
    return <ConnectingCard baseContext={props.baseContext} />;
  }

  return (
    <div className="wrapper">
      <Outlet context={fullContext} />
    </div>
  );
};
function setLocalInfo(arg0: {
  qrId: string;
  qrPwd: string;
  type: "host";
  wines: import("./types/local-info-types").Wine[];
  tasters: import("./types/local-info-types").LocalInfoTaster[];
}) {
  throw new Error("Function not implemented.");
}
