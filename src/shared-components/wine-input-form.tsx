import React, { useEffect, useState } from "react";
import {
  Button,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Card,
  Icon,
} from "@blueprintjs/core";
import { Wine } from "../types/local-info-types";
import { MultiSelect } from "@blueprintjs/select";
import { getNextLetter } from "../utils/generic-utils";

// MultiSelect item renderer for flavors
const renderFlavorItem = (flavor: string, { modifiers, handleClick }: any) => (
  <li
    key={flavor}
    className={modifiers.active ? "bp4-menu-item-active" : ""}
    onClick={handleClick}
  >
    {flavor}
  </li>
);

// MultiSelect tag renderer for flavors
const renderFlavorTag = (flavor: string) => flavor;

// Props for the component
type WineInputFormProps = {
  wines: Record<string, Wine>;
  onSubmit: (wine: Wine) => void;
  isTaster: boolean;
};

export const WineInputForm: React.FC<WineInputFormProps> = ({
  wines,
  onSubmit,
  isTaster,
}) => {
  const wineList = Object.values(wines);

  // States for form fields
  // const [identifier, setIdentifier] = useState(
  //  "Wine " + getNextLetter(wineList.length)
  //);
  const [nickname, setNickname] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [varietal, setVarietal] = useState("");
  const [region, setRegion] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  /*
  useEffect(() => {
    console.log("SETTING IDENTIGIER", wines.length);
    setIdentifier("Wine " + getNextLetter(wineList.length));
  }, [wines.length]);

  console.log("RENDER WINEINPUT FORM", wines);
  */

  const identifier = "Wine " + getNextLetter(wineList.length);

  // Derive unique options from wines array or set to empty arrays for free-form entry
  const pointsOptions = wines
    ? Array.from(new Set(wineList.map((wine) => wine.points)))
    : [];
  const yearOptions = wines
    ? Array.from(new Set(wineList.map((wine) => wine.year)))
    : [];
  const varietalOptions = wines
    ? Array.from(new Set(wineList.map((wine) => wine.varietal)))
    : [];
  const regionOptions = wines
    ? Array.from(new Set(wineList.map((wine) => wine.region)))
    : [];
  const priceOptions = wines
    ? Array.from(new Set(wineList.map((wine) => wine.price)))
    : [];
  const flavorOptions = wines
    ? Array.from(new Set(wineList.flatMap((wine) => wine.flavors)))
    : [];

  // Handle form submission
  const handleSubmit = () => {
    const newWine: Wine = {
      identifier,
      name,
      points,
      year,
      varietal,
      region,
      price,
      flavors: selectedFlavors,
    };

    onSubmit(newWine);

    // Clear form after submission
    setNickname("");
    setNotes("");
    setName("");
    setYear(null);
    setVarietal("");
    setRegion("");
    setPrice(null);
    setPoints(null);
    setSelectedFlavors([]);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <FormGroup label="Identifier" labelFor="identifier-input">
        <InputGroup
          disabled={true}
          id="identifier-input"
          value={identifier}
          //onChange={(e) => setIdentifier(e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Name" labelFor="name-input">
        <InputGroup
          id="name-input"
          //value={identifier}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Points" labelFor="points-select">
        <InputGroup
          id="points-select"
          type="number"
          value={points?.toString()}
          onChange={(e) => setPoints(Number(e.target.value) || null)}
        />
      </FormGroup>

      <FormGroup label="Year" labelFor="year-select">
        <InputGroup
          id="year-select"
          type="number"
          value={year?.toString()}
          onChange={(e) => setYear(Number(e.target.value) || null)}
        />
      </FormGroup>

      <FormGroup label="Varietal" labelFor="varietal-select">
        <InputGroup
          id="varietal-select"
          onChange={(e) => setVarietal(e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Region" labelFor="region-select">
        <InputGroup
          id="region-select"
          onChange={(e) => setRegion(e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Price" labelFor="price-select">
        <InputGroup
          id="price-select"
          onChange={(e) => setPrice(Number(e.target.value) || null)}
        />
      </FormGroup>

      <FormGroup label="Tasting Notes" labelFor="tasting-notes-multiselect">
        <MultiSelect
          id="tasting-notes-multiselect"
          items={flavorOptions}
          itemRenderer={renderFlavorItem}
          tagRenderer={renderFlavorTag}
          selectedItems={selectedFlavors}
          resetOnSelect={true}
          onItemSelect={(flavor) => {
            if (!selectedFlavors.includes(flavor)) {
              setSelectedFlavors([...selectedFlavors, flavor]);
            }
          }}
          onRemove={(flavor) => {
            setSelectedFlavors(selectedFlavors.filter((f) => f !== flavor));
          }}
          createNewItemFromQuery={isTaster ? null : (query) => query}
          createNewItemRenderer={
            isTaster
              ? null
              : (query, active, handleClick) => (
                  <Card
                    key="create-new-flavor"
                    className={active ? "bp4-menu-item-active" : ""}
                    onClick={handleClick}
                  >
                    <div className="center-row">
                      <Icon icon="add" />
                      <div style={{ marginLeft: "10px" }}>
                        Create new tasting note: <b>{query}</b>
                      </div>
                    </div>
                  </Card>
                )
          }
          placeholder="Tasting notes..."
        />
      </FormGroup>

      <Button type="submit" intent="primary">
        Submit
      </Button>
    </form>
  );
};
