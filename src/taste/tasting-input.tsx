import React, { useState } from "react";
import { Button, FormGroup, InputGroup, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { WineTasting, Wine } from "../types/local-info-types";

interface WineTastingFormProps {
  initialData: WineTasting;
  wines: Record<string, Wine>;
  onSubmit: (data: WineTasting) => void;
}

// Helper to get unique sorted values for points, price, and flavors
const getUniqueValues = <T,>(array: T[]): T[] =>
  Array.from(new Set(array)).sort();

export const TastingInput: React.FC<WineTastingFormProps> = ({
  initialData,
  wines,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<WineTasting>(initialData);

  // Extract unique values for select options
  const pointOptions = getUniqueValues(
    Object.values(wines).map((wine) => wine.points)
  );
  const priceOptions = getUniqueValues(
    Object.values(wines).map((wine) => wine.price)
  );
  const flavorOptions = getUniqueValues(
    Object.values(wines).flatMap((wine) => wine.flavors)
  );

  const handleChange = (field: keyof WineTasting, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div>
      <FormGroup label="Wine ID" labelFor="wine-id">
        <InputGroup
          id="wine-id"
          value={formData.wineId}
          disabled={true}
          onChange={(e) => handleChange("wineId", e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Nickname" labelFor="nickname">
        <InputGroup
          id="nickname"
          value={formData.nickname}
          onChange={(e) => handleChange("nickname", e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Notes" labelFor="notes">
        <InputGroup
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Points" labelFor="points">
        <Select<number>
          items={pointOptions}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item}
              text={item?.toString()}
              onClick={handleClick}
              active={modifiers.active}
            />
          )}
          onItemSelect={(item) => handleChange("points", item)}
          filterable={false}
        >
          <Button
            text={formData.points?.toString()}
            rightIcon="double-caret-vertical"
          />
        </Select>
      </FormGroup>

      <FormGroup label="Price" labelFor="price">
        <Select<number>
          items={priceOptions}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item}
              text={`$${item?.toFixed(2)}`}
              onClick={handleClick}
              active={modifiers.active}
            />
          )}
          onItemSelect={(item) => handleChange("price", item)}
          filterable={false}
        >
          <Button
            text={`$${formData?.price?.toFixed(2)}`}
            rightIcon="double-caret-vertical"
          />
        </Select>
      </FormGroup>

      {false && (
        <FormGroup label="Flavors" labelFor="flavors">
          <Select<string>
            items={flavorOptions}
            itemRenderer={(item, { handleClick, modifiers }) => (
              <MenuItem
                key={item}
                text={item}
                onClick={() =>
                  handleChange("flavors", [...formData.flavors, item])
                }
                active={modifiers.active}
              />
            )}
            onItemSelect={(item) =>
              handleChange("flavors", [...formData.flavors, item])
            }
            filterable={true}
          >
            <Button
              text={
                formData.flavors.length
                  ? formData.flavors.join(", ")
                  : "Select Flavors"
              }
              rightIcon="double-caret-vertical"
            />
          </Select>
        </FormGroup>
      )}

      <Button intent="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};
