import { Card } from "@blueprintjs/core";
import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContextBase } from "../types/context-types";
import { TastersList } from "./tasters-list";
import { TastersInstructions } from "./tasters-instructions";
import { QRCodeSVG } from "qrcode.react";
import { Divider } from "@blueprintjs/core";

// Instructions component for wine tasting
export const QRCode = () => {
  const context = useOutletContext<OutletContextBase>();

  if (context.localInfo.type !== "host") {
    return (
      <Card className={"center"}>
        <h3>Page only valid for hosts</h3>
      </Card>
    );
  }

  const connectionSpec = context.connectionSpec;

  const QRurl = `https://thbrown.github.io/wine-tasting/#/connect?roomId=${connectionSpec.roomId}&roomPwd=${connectionSpec.roomPwd}&localId=${context.localInfo.qrId}&localPwd=${context.localInfo.qrPwd}`;

  useMemo(() => {
    // For local development we might not be able to use the QR code
    console.log("QR code url", QRurl);
  }, [QRurl]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className={"stack"}>
        <TastersInstructions />
        <TastersList />
      </div>
      <Divider />
      <div className={"qr-code-wrapper"}>
        <h3 className={"qr-code-text"}>
          Scan the code to sign up for wine tasting!
        </h3>
        <div className={"qr-code-text"}>
          Tasting Room: {connectionSpec?.roomId}
        </div>
        <br />
        {connectionSpec == null ? (
          <i>
            Create a tasting and the QR code needed to join will appear here.
          </i>
        ) : (
          <QRCodeSVG value={QRurl} size={150} />
        )}
        <div className={"qr-code-text"}>
          <a href={QRurl}>link</a> | {context.localInfo.qrId}
        </div>
      </div>
    </div>
  );
};
