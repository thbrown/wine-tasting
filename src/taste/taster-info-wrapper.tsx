import React, { useEffect, useState } from "react";

import { LocalInfoTaster } from "../types/local-info-types";
import LocalInfoTasterForm from "./taste-info";
import { useOutletContext } from "react-router-dom";
import { OutletContextConnected } from "../types/context-types";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export type LocalInfoTasterInput = Omit<LocalInfoTaster, "wineTastings">;

type LocalInfoTasterFormProps = {};

export const LocalInfoTasterWrapper: React.FC<
  LocalInfoTasterFormProps
> = ({}) => {
  const context = useOutletContext<OutletContextConnected>();
  const navigate = useNavigate();

  if (context.localInfo.type !== "taster") {
    return <div>Page only valid for tasters</div>;
  }
  return (
    <LocalInfoTasterForm
      onSubmit={function (taster: LocalInfoTaster): void {
        context.sendMessage({
          id: uuidv4(),
          target: "host",
          direction: "request",
          source: context.connectionSpec.localId,
          data: {
            type: "clientPushInfo",
            info: taster,
          },
        });
        navigate("/taste");
      }}
      taster={context.localInfo}
    />
  );
};

export default LocalInfoTasterForm;
