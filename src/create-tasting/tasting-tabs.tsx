import React, { useEffect, useMemo, useState } from "react";
import { TastingSetup } from "./tasting-setup";
import { WineInputForm } from "../shared-components/wine-input-form";
import { Button, Card, Dialog, Tab, Tabs } from "@blueprintjs/core";

import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../parent";
import { useNavigate } from "react-router-dom";
import { createNewRoom } from "../utils/generic-utils";
import { QRCode } from "./tasters-qr-code";
import { WineCard } from "../shared-components/wine-card";

export const CreateTastingTabs = () => {
  const navigate = useNavigate();
  const context = useOutletContext<OutletContext>();
  const { localInfo, switchRoom, connectionSpec } = context;

  const [selectedTab, setSelectedTab] = useState<string | number>("form");
  const [isOpen, setIsOpen] = React.useState(localInfo.type === "none");

  const handleContinue = () => {
    setIsOpen(false);
    localStorage.clear();
    if (context.connectionStatus === "connected") {
      context.clearTimers();
    }
    const room = createNewRoom();
    switchRoom(room, true);
  };

  const handleCancel = () => {
    if (localInfo.type === "none") {
      navigate("/");
    }
    setIsOpen(false);
  };

  const onCreateNewTasting = () => {
    setIsOpen(true);
  };

  const renderNewTastingPrompt = () => {
    const auxMessage =
      localInfo?.type === "taster" || localInfo?.type === "host"
        ? "WARNING: Starting a new tasting session will delete any data you have saved for the current tasting session"
        : "";

    return (
      <Dialog
        isOpen={isOpen}
        onClose={handleCancel}
        title="Start New Tasting Event"
      >
        <div className={"center standard-padding"}>
          <div className="bp4-dialog-body">
            <p>Do you want to start a new tasting event?</p>
            <p>{auxMessage}</p>
          </div>
          <div className="bp4-dialog-footer">
            <Button className="button" intent="danger" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="button"
              intent="primary"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };

  if (context.localInfo.type !== "host") {
    return <div>Only hosts can create a tasting</div>;
  }

  return (
    <>
      <Tabs selectedTabId={selectedTab} onChange={(tab) => setSelectedTab(tab)}>
        <Tab
          id="form"
          title="Wine List"
          panel={
            <>
              <Card>
                <div>
                  <h3>Wine List for Tasting: </h3>
                  <Button
                    icon="add"
                    intent={"warning"}
                    onClick={onCreateNewTasting}
                  >
                    Create new tasting (delete current)
                  </Button>
                </div>
                <div>
                  {context.localInfo.wines.map((wine, index) => (
                    <WineCard wine={wine} key={"wine" + index} />
                  ))}
                </div>
              </Card>
              <Card>
                <h3>Add a Wine</h3>
                <WineInputForm
                  isTaster={false}
                  wines={context.localInfo.wines}
                  onSubmit={(wineValue) => {
                    console.log("Submitted", wineValue);
                    if (context.localInfo.type === "host") {
                      console.log("Updating", context.localInfo);

                      context.setLocalInfo({
                        ...context.localInfo,
                        wines:
                          context.localInfo.wines == null
                            ? [wineValue]
                            : [...context.localInfo.wines, wineValue],
                      });
                    }
                  }}
                />
              </Card>
              {renderNewTastingPrompt()}
            </>
          }
        />

        <Tab id="qr-code" title="Wine Tasting QR" panel={<QRCode />} />
      </Tabs>
    </>
  );
};
