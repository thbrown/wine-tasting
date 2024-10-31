import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { InfoSign } from "@blueprintjs/icons";
import React, { useState } from "react";

interface InfoDialogProps {
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}

export function InfoDialog(props: InfoDialogProps): JSX.Element {
  const clearContent = () => {
    props.setContent(undefined);
  };

  if (props.content === undefined) {
    return <div> </div>;
  }

  return (
    <div>
      <Dialog title="Tasting" icon={<InfoSign />} isOpen={true}>
        <DialogBody>{props.content}</DialogBody>
        <DialogFooter
          minimal={true}
          actions={
            <Button intent="primary" text="Okay" onClick={clearContent} />
          }
        />
      </Dialog>
    </div>
  );
}
