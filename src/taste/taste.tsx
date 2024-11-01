import { Card, Spinner } from "@blueprintjs/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { OutletContextConnected } from "../types/context-types";

// Instructions component for wine tasting
export const Taste = () => {
  const context = useOutletContext<OutletContextConnected>();

  return (
    <div>
      <div>Prepare to taste!</div>
      <div>Successfully connected to tasting!</div>
      <div>RoomId: {context.connectionSpec?.roomId}</div>
      <div>LocalId: {context.connectionSpec?.localId}</div>
    </div>
  );
};
