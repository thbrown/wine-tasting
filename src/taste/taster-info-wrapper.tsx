import React, { useEffect, useState } from "react";
import {
  Button,
  FormGroup,
  InputGroup,
  NumericInput,
  Radio,
  RadioGroup,
  HTMLSelect,
} from "@blueprintjs/core";
import { LocalInfoTaster } from "../types/local-info-types";
import LocalInfoTasterForm from "./taste-info";
import { useOutletContext } from "react-router-dom";
import { OutletContextConnected } from "../types/context-types";

export type LocalInfoTasterInput = Omit<LocalInfoTaster, "wineTastings">;

type LocalInfoTasterFormProps = {};

export const LocalInfoTasterWrapper: React.FC<
  LocalInfoTasterFormProps
> = ({}) => {
  const context = useOutletContext<OutletContextConnected>();

  if (context.localInfo.type !== "taster") {
    return <div>Page only valid for tasters</div>;
  }
  return (
    <LocalInfoTasterForm
      onSubmit={function (taster: LocalInfoTaster): void {
        console.log(taster);
      }}
      taster={context.localInfo}
    />
  );
};

export default LocalInfoTasterForm;
