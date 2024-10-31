import React, { useState } from "react";
import {
  Tabs,
  Tab,
  FormGroup,
  InputGroup,
  Button,
  Card,
  Divider,
  MenuItem,
} from "@blueprintjs/core";
import {
  ItemRenderer,
  ItemRendererProps,
  MultiSelect,
} from "@blueprintjs/select";

// Wine flavors options
const wineFlavors = [
  "Fruity",
  "Earthy",
  "Spicy",
  "Floral",
  "Smoky",
  "Herbal",
  "Citrusy",
  "Nutty",
];

export const TastingSetup = ({ addWine }: any) => {
  const [wineName, setWineName] = useState("");
  const [wineVarietal, setWineVarietal] = useState("");
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [winePrice, setWinePrice] = useState("");
  const [wineRegion, setWineRegion] = useState("");
  const [winePoints, setWinePoints] = useState("");

  const handleFlavorSelect = (flavor: any) => {
    if (!selectedFlavors.includes(flavor)) {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const handleFlavorRemove = (flavor: any) => {
    setSelectedFlavors(selectedFlavors.filter((f) => f !== flavor));
  };

  const handleSubmit = () => {
    addWine({
      wineName,
      wineVarietal,
      wineFlavors: selectedFlavors,
      winePrice,
      wineRegion,
      winePoints,
    });
    // Clear form after submission
    setWineName("");
    setWineVarietal("");
    setSelectedFlavors([]);
    setWinePrice("");
    setWineRegion("");
  };

  return (
    <Card>
      <FormGroup label="Wine Name">
        <InputGroup
          value={wineName}
          onChange={(e) => setWineName(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Wine Varietal">
        <InputGroup
          value={wineVarietal}
          onChange={(e) => setWineVarietal(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Wine Points">
        <InputGroup
          value={winePoints}
          onChange={(e) => setWinePoints(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Wine Flavors">
        <MultiSelect<string>
          items={wineFlavors}
          itemRenderer={(
            item: string,
            itemProps: ItemRendererProps
          ): React.JSX.Element | null => {
            // <-- Fix here
            if (!itemProps.modifiers.matchesPredicate) {
              return null;
            }
            return (
              <MenuItem
                key={item}
                roleStructure="listoption"
                shouldDismissPopover={false}
                text={`${item}`}
                //onClick={itemProps.handleClick} // Make sure handleClick is called
                active={itemProps.modifiers.active}
              />
            );
          }}
          onItemSelect={handleFlavorSelect}
          selectedItems={selectedFlavors}
          tagInputProps={{
            onRemove: (_, index) => handleFlavorRemove(selectedFlavors[index]),
            tagProps: { minimal: true },
          }}
          noResults={<em>No flavors found.</em>}
          tagRenderer={(item: string): React.ReactNode => {
            return <div>{item}</div>;
          }}
        />
      </FormGroup>
      <FormGroup label="Wine Price">
        <InputGroup
          value={winePrice}
          onChange={(e) => setWinePrice(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Wine Region">
        <InputGroup
          value={wineRegion}
          onChange={(e) => setWineRegion(e.target.value)}
        />
      </FormGroup>
      <Button intent="primary" onClick={handleSubmit}>
        Add Wine
      </Button>
    </Card>
  );
};
