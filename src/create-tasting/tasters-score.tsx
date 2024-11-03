import { Card } from "@blueprintjs/core";
import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContextBase } from "../types/context-types";
import { TastersList } from "./tasters-list";
import { TastersInstructions } from "./tasters-instructions";
import { QRCodeSVG } from "qrcode.react";
import { Divider } from "@blueprintjs/core";
import { LocalInfoTaster } from "../types/local-info-types";

// Instructions component for wine tasting
export const TasterScore = () => {
  const context = useOutletContext<OutletContextBase>();

  if (context.localInfo.type !== "host") {
    return (
      <Card className={"center"}>
        <h3>Page only valid for hosts</h3>
      </Card>
    );
  }

  const favoriteWineData: Record<
    string,
    { ratingSum: number; n: number; display: string }
  > = {};
  for (let tasterId in context.localInfo.tasters) {
    const taster = context.localInfo.tasters[tasterId] as LocalInfoTaster;
    if (Object.keys(taster).length === 0) {
      continue;
    }
    for (let i = 0; i < taster.wineTastings.length; i++) {
      const wineId = taster.wineTastings[i].wineId;
      const wineInfo = context.localInfo.wines[wineId];
      const entry = favoriteWineData[wineId];
      if (entry === undefined) {
        favoriteWineData[wineId] = {
          ratingSum: i,
          n: 1,
          display:
            wineInfo.name +
            " " +
            wineInfo.year +
            " $" +
            wineInfo.price +
            " " +
            wineInfo.points +
            "pts",
        };
      } else {
        favoriteWineData[wineId] = {
          ratingSum: favoriteWineData[wineId].ratingSum + i,
          n: favoriteWineData[wineId].n + 1,
          display:
            wineInfo.name +
            " " +
            wineInfo.year +
            " $" +
            wineInfo.price +
            " " +
            wineInfo.points +
            "pts",
        };
      }
    }
  }

  const favoriteTable = Object.entries(favoriteWineData).map(
    ([wineId, { ratingSum, n }]) => ({
      wineId,
      avgScore: ratingSum / n,
      display: favoriteWineData[wineId].display,
    })
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {favoriteTable.map((wine) => (
        <Card key={wine.wineId} className={"center"}>
          <h3>{"Wine:" + wine.display}</h3>
          <p>Average Score: {wine.avgScore + 1}</p>
        </Card>
      ))}
    </div>
  );
};
