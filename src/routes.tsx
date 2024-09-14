import React, { useEffect, useState } from "react";
import { HotkeysProvider } from "@blueprintjs/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./Routes.scss";

const router = createBrowserRouter([
  {
    path: "/create-tasting",
    element: (
      <div className="wrapper">
        <div className="main-margin">CREATE A TASTING!</div>
      </div>
    ),
  },
  {
    path: "/signup",
    element: (
      <div className="wrapper">
        <div className="main-margin">SIGNUP FOR WINE TASTING!</div>
      </div>
    ),
  },
  {
    path: "/taste",
    element: (
      <div className="wrapper">
        <div className="main-margin">TASTE WINES!</div>
      </div>
    ),
  },
  {
    path: "/progress",
    element: (
      <div className="wrapper">
        <div className="main-margin">SEE HOW MUCH TASTING IS LEFT TO DO!</div>
      </div>
    ),
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
