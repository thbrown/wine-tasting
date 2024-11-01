import { Card } from "@blueprintjs/core";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContextConnected } from "../types/context-types";
import { LocalInfoTaster } from "../types/local-info-types";

// Instructions component for wine tasting
export const TastersList = () => {
  const context = useOutletContext<OutletContextConnected>();

  if (context.localInfo.type !== "host") {
    return <div>Page only valid for hosts</div>;
  }

  const tasterIds = Object.keys(context.localInfo.tasters);

  const tasterElements: React.ReactNode[] = [];
  for (let tasterId of tasterIds) {
    const tasterLocalInfo = context.localInfo.tasters[
      tasterId
    ] as LocalInfoTaster;
    if (Object.keys(tasterLocalInfo).length === 0) {
      tasterElements.push(<li key={tasterId}>{tasterId}</li>);
    } else {
      tasterElements.push(<li key={tasterId}>{tasterLocalInfo.name}</li>);
    }
  }

  if (tasterElements.length === 0) {
    tasterElements.push(
      <div key="no-tasters">
        <i>No tasters enrolled yet</i>
      </div>
    );
  }

  return (
    <Card>
      <h3>Wine Tasters Enrolled</h3>
      <ol>{tasterElements}</ol>
    </Card>
  );
};
