import { Card } from "@blueprintjs/core";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../parent";

// Instructions component for wine tasting
export const TastersList = () => {
  const context = useOutletContext<OutletContext>();

  return (
    <Card>
      <h3>Wine Tasters Enrolled</h3>
      <ol>
        <li>Bill B</li>
        <li>Mike S</li>
        <li>Andy R</li>
        <li>Herm E</li>
        <li>Marty S</li>
      </ol>
    </Card>
  );
};
