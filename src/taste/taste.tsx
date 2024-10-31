import { Card, Spinner } from "@blueprintjs/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { OutletContext, ConnectionSpecification } from "../parent";
import { useNavigate } from "react-router-dom";

// Instructions component for wine tasting
export const Taste = () => {
  const context = useOutletContext<OutletContext>();

  if (context.connectionStatus !== "connected") {
    return (
      <Card>
        <h3>Connecting...</h3>
        <Spinner />
      </Card>
    );
  }

  return (
    <div>
      <div>Successfully connected to tasting!</div>
      <div>RoomId: {context.connectionSpec?.roomId}</div>
      <div>LocalId: {context.connectionSpec?.localId}</div>
    </div>
  );
};
