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
import { useOutletContext } from "react-router-dom";
import { OutletContextConnected } from "../types/context-types";

export type LocalInfoTasterInput = Omit<LocalInfoTaster, "wineTastings">;

type LocalInfoTasterFormProps = {
  onSubmit: (taster: LocalInfoTaster) => void;
  taster: LocalInfoTaster;
};

export const LocalInfoTasterForm: React.FC<LocalInfoTasterFormProps> = ({
  onSubmit,
  taster,
}) => {
  const context = useOutletContext<OutletContextConnected>();

  const [name, setName] = useState(taster?.name || "");
  const [gender, setGender] = useState<"M" | "F" | undefined>(taster?.gender);
  const [age, setAge] = useState<number | undefined>(taster?.age);
  const [wineExperience, setWineExperience] = useState<
    "none" | "some" | "lots" | undefined
  >(taster?.wineExperience || "none");

  /*
  useEffect(() => {
    if (taster) {
      setName(taster.name);
      setGender(taster.gender);
      setAge(taster.age);
      setWineExperience(taster.wineExperience || "none");
    }
  }, [taster]);
  */

  const handleSubmit = () => {
    const newTaster: LocalInfoTaster = {
      ...taster,
      type: "taster",
      name,
      gender,
      age,
      wineExperience,
    };
    onSubmit(newTaster);
  };

  return (
    <div>
      <div>
        <h3>Wine taster info</h3>
        <h4>ConnectionId: {context.connectionSpec.localId}</h4>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormGroup label="Name" labelFor="name-input">
          <InputGroup
            id="name-input"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Gender">
          <RadioGroup
            onChange={(e) => setGender(e.currentTarget.value as "M" | "F")}
            selectedValue={gender}
          >
            <Radio label="Male" value="M" />
            <Radio label="Female" value="F" />
          </RadioGroup>
        </FormGroup>

        <FormGroup label="Age">
          <NumericInput
            placeholder="Enter age"
            min={1}
            value={age}
            onValueChange={(valueAsNumber) => setAge(valueAsNumber)}
          />
        </FormGroup>

        <FormGroup label="Wine Experience">
          <HTMLSelect
            value={wineExperience}
            onChange={(e) =>
              setWineExperience(
                e.currentTarget.value as "none" | "some" | "lots"
              )
            }
          >
            <option value="none">None</option>
            <option value="some">Some</option>
            <option value="lots">Lots</option>
          </HTMLSelect>
        </FormGroup>

        <Button intent="primary" type="submit" text="Submit" />
      </form>
    </div>
  );
};

export default LocalInfoTasterForm;
