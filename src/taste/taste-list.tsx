import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LocalInfoTaster, Wine, WineTasting } from "../types/local-info-types";
import { OutletContextConnected } from "../types/context-types";
import { CSS } from "@dnd-kit/utilities";
import { Button, Dialog, Icon } from "@blueprintjs/core";
import { TastingInput } from "./tasting-input";
import { v4 as uuidv4 } from "uuid";

interface WineCombo {
  wine: Wine;
  wineTasting: WineTasting;
}

export const TasteList = () => {
  const context = useOutletContext<OutletContextConnected>();
  const navigate = useNavigate();
  /*
  if (context.localInfo.type !== "taster") {
    return <div>Page only valid for tasters</div>;
  }
    */
  // TODO: fix casts

  const localInfo: LocalInfoTaster = context.localInfo as LocalInfoTaster;
  const comboList: WineCombo[] = localInfo.wineTastings.map((wt) => {
    const wine = localInfo.winesToTaste[wt.wineId];
    return { wine: wine, wineTasting: wt };
  });
  const [sortedWineIds, setSortedWinesIds] = useState(
    comboList.map((v) => v.wine.identifier)
  );

  const handleSortEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sortedWineIds.findIndex((id) => id === active.id);
      const newIndex = sortedWineIds.findIndex((id) => id === over.id);
      setSortedWinesIds((ids) => arrayMove(ids, oldIndex, newIndex));
      // setSortedWinesIds((wines) => arrayMove(wines, oldIndex, newIndex));
    }
  };

  // Keep localInfo tastings order in sync with local sorted list
  useEffect(() => {
    console.log("SETTING WINE TASTINGS TO", sortedWineIds);
    const newValue = {
      ...(context.localInfo as LocalInfoTaster),
      wineTastings: sortedWineIds.map(
        (id) => comboList.find((c) => c.wine.identifier === id)!.wineTasting
      ),
    };
    context.setLocalInfo(newValue);
    context.sendMessage({
      id: uuidv4(),
      target: "host",
      direction: "request",
      source: context.connectionSpec.localId,
      data: {
        type: "clientPushInfo",
        info: newValue,
        nextPage: null,
      },
    });
  }, [sortedWineIds]);

  const [editWine, setEditWine] = useState(undefined as WineCombo | undefined);

  const handleWineClick = (combo: WineCombo) => {
    console.log("CLICKED", combo.wine.identifier);
    setEditWine(combo);
  };

  const handleCancel = () => {
    setEditWine(undefined);
  };

  if (context.localInfo.type !== "taster") {
    return <div>This is a taster page</div>;
  }

  const renderNewTastingPrompt = () => {
    return (
      <Dialog
        isOpen={editWine != undefined}
        onClose={handleCancel}
        title="Score this wine"
      >
        <div className={"center standard-padding"}>
          <div className="bp4-dialog-body">
            <p>Score this wine!</p>
            <p>{editWine?.wine.identifier}</p>
            <TastingInput
              initialData={editWine?.wineTasting}
              wines={localInfo.winesToTaste}
              onSubmit={function (data: WineTasting): void {
                const newTastings = localInfo.wineTastings.map((wt) =>
                  wt.wineId === data.wineId ? data : wt
                );
                const newValue = {
                  ...localInfo,
                  wineTastings: newTastings,
                };
                console.log("SUBMITTED", data, newValue);
                context.setLocalInfo(newValue);
                setEditWine(undefined);
                context.sendMessage({
                  id: uuidv4(),
                  target: "host",
                  direction: "request",
                  source: context.connectionSpec.localId,
                  data: {
                    type: "clientPushInfo",
                    info: newValue,
                    nextPage: null,
                  },
                });
              }}
            ></TastingInput>
          </div>
          <div className="bp4-dialog-footer"></div>
        </div>
      </Dialog>
    );
  };

  // Set up sensors for touch and mouse support
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const sortedWines = comboList; /*comboList.sort((a, b) => {
    return (
      sortedWineIds.indexOf(a.wine.identifier) -
      sortedWineIds.indexOf(b.wine.identifier)
    );
  });*/
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleSortEnd}
    >
      <h2>Sort Your Wines</h2>
      <i>Favorite</i>
      <SortableContext
        items={sortedWines.map((combo) => combo.wine.identifier)}
        strategy={verticalListSortingStrategy}
      >
        {sortedWines.map((combo: WineCombo) => (
          <SortableItem
            key={combo.wine.identifier}
            id={combo.wine.identifier}
            wine={combo.wine}
            wineTasting={combo.wineTasting}
            onClick={() => handleWineClick(combo)}
          />
        ))}
      </SortableContext>
      <i>Least Favorite</i>
      {renderNewTastingPrompt()}
    </DndContext>
  );
};

const SortableItem = ({
  id,
  wine,
  wineTasting,
  onClick,
}: {
  id: string;
  wine: Wine;
  wineTasting: WineTasting;
  onClick: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    border: "1px solid #ddd",
    marginBottom: "5px",
    cursor: "pointer",
    touchAction: "none", // helps prevent touch scrolling during drag
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={"spaced-row"}
      >
        <div {...listeners} style={{ width: "50px", height: "50px" }}>
          <Icon size={48} icon="drag-handle-vertical" />
        </div>
        <div>
          <div>
            <b>{wine.identifier}</b>
          </div>
          <div>
            {wineTasting.nickname} {wineTasting.points}pts ${wineTasting.price}
          </div>
        </div>
        <Button icon="edit" large={true} onClick={onClick} />
      </div>
    </>
  );
};
