import React, { useEffect, useState } from "react";
import { HotkeysProvider } from "@blueprintjs/core";
import {
  createHashRouter,
  HashRouter,
  Link,
  RouterProvider,
} from "react-router-dom";

import "./Routes.scss";
import { CreateTastingTabs } from "./create-tasting/tasting-tabs";
import { Parent } from "./parent";
import { Connect } from "./connect/connect";
import { Taste } from "./taste/taste";
import { LocalInfoTasterForm } from "./taste/taste-info";
import TasterInfoWrapper, {
  LocalInfoTasterWrapper,
} from "./taste/taster-info-wrapper";

const router = createHashRouter([
  {
    path: "connect",
    element: <Connect />,
  },
  {
    path: "/",
    element: <Parent />,
    children: [
      {
        index: true,
        element: (
          <div className="wrapper">
            <div className="main-margin directory">
              <h1>Directory</h1>
              <Link to="/create-tasting">Create Tasting</Link>
              <Link to="/signup">Signup</Link>
              <Link to="/taste">Taste</Link>
              <Link to="/taste-info">Taste Info</Link>
              <Link to="/progress">Progress</Link>
            </div>
          </div>
        ),
      },
      {
        path: "create-tasting",
        element: <CreateTastingTabs />,
      },
      {
        path: "signup",
        element: <div className="main-margin">SIGNUP FOR WINE TASTING!</div>,
      },
      {
        path: "taste",
        element: <Taste />,
      },
      {
        path: "taste-info",
        element: <LocalInfoTasterWrapper />,
      },
      {
        path: "progress",
        element: (
          <div className="main-margin">SEE HOW MUCH TASTING IS LEFT TO DO!</div>
        ),
      },
    ],
  },
]);

export const Routes: React.FC = () => {
  try {
    return (
      <HotkeysProvider>
        <RouterProvider router={router} />
      </HotkeysProvider>
    );
  } catch (e) {
    console.error(e);
    alert("Top level error" + e + " - " + e.stack);
  }
};
