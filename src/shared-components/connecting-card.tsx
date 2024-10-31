import React from "react";
import { Card, Spinner } from "@blueprintjs/core";
import { OutletContextBase } from "../types/context-types";

interface Props {
  baseContext?: OutletContextBase;
}

export const ConnectingCard: React.FC<Props> = ({ baseContext }) => {
  if (baseContext == null) {
    return (
      <Card className="center full-height">
        <h3 className="center">
          <div className="standard-padding">Loading...</div>
        </h3>
        <Spinner size={100} />
      </Card>
    );
  } else {
    return (
      <Card className="center full-height">
        <h3 className="center">
          <div className="standard-padding">
            Connecting to wine tasting room
          </div>
          <span className="code">{baseContext.connectionSpec.roomId}</span>
        </h3>
        <Spinner size={100} />
        <br />
        <div className="center">
          <i className="standard-padding">With identity</i>
          <div className="code">{baseContext.connectionSpec.localId}</div>
        </div>
      </Card>
    );
  }
};
