import React from "react";
import { Card, Elevation, Tag, H5 } from "@blueprintjs/core";
import { Wine } from "../types/local-info-types";

// Props for the component
type WineCardProps = {
  wine: Wine;
};

export const WineCard: React.FC<WineCardProps> = ({ wine }) => {
  return (
    <Card elevation={Elevation.TWO} style={{ margin: "10px", padding: "15px" }}>
      <H5>{wine.identifier}</H5>
      <div style={{ marginBottom: "10px" }}>
        <strong>Name:</strong> {wine.name}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Points:</strong> {wine.points}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Year:</strong> {wine.year}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Varietal:</strong> {wine.varietal}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Region:</strong> {wine.region}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Price:</strong> ${wine?.price?.toFixed(2)}
      </div>
      <div>
        <strong>Flavors:</strong>
        <div style={{ marginTop: "5px" }}>
          {wine.flavors.length > 0 ? (
            wine.flavors.map((flavor, index) => (
              <Tag
                key={index}
                style={{ marginRight: "5px", marginBottom: "5px" }}
              >
                {flavor}
              </Tag>
            ))
          ) : (
            <em>No flavors specified</em>
          )}
        </div>
      </div>
    </Card>
  );
};
