import { useRef, useState } from "react";
import { GAME_PROPS } from "../config";
import {
  BasicProperties,
  Pawn as PawnType,
  Player,
  Position,
} from "../types/types";
import {
  fieldModificator,
  createFields,
  selectNextMoves,
  pawnModificator,
} from "../utils/utils";
import { Pawn } from "../ui/Pawn";
import { Field } from "../ui/Field";
import clsx from "clsx";
import { computerMove, wait } from "../computer/computer";

export default function Board() {
  // const [color, setColor] = useState(false);
  const [player, setPlayer] = useState<Player>(2);
  const [fields, setFields] = useState(createFields(GAME_PROPS.BOARD_FIELDS));
  const clickedPawn = useRef<PawnType | null>();

  function getPossibleFields<T extends BasicProperties>(this: T) {
    // console.log(this);
  }

  const pawnHandler = ({ x, y }: Position) => {
    const changedFields = [...fields];
    if (!changedFields[y][x].pawn) return;

    clickedPawn.current = fields[y][x].pawn;
    pawnModificator(changedFields, { clicked: false });
    changedFields[y][x].pawn.clicked = !changedFields[y][x].pawn.clicked;
    fieldModificator(changedFields, { framed: false });
    selectNextMoves(changedFields, { x, y }, player);

    setFields(changedFields);
  };

  const fieldHandler = async ({ x, y }: Position) => {
    if (!clickedPawn.current || !fields[y][x].framed) return;

    const changedFields = [...fields];
    clickedPawn.current.move(changedFields, { x, y });
    fieldModificator(changedFields, { framed: false });
    pawnModificator(changedFields, { clicked: false });

    setFields(changedFields);
    // setPlayer((player) => (player === 1 ? 2 : 1));

    await wait();
    setFields([...computerMove(changedFields)]);
  };

  return (
    <>
      <div className="grid-cols-8 grid w-full">
        {fields.map((col, y) =>
          col.map((field, x) => {
            return (
              <Field
                key={field.id}
                onClick={() => fieldHandler(field.position)}
                {...field}
              >
                {field.pawn && (
                  <Pawn
                    color={field.pawn.color}
                    onClick={(e, position) => {
                      e.stopPropagation();
                      return field.pawn.player === player
                        ? pawnHandler(position)
                        : undefined;
                    }}
                    clicked={field.pawn.clicked}
                    position={{ x, y }}
                    canClick={field.pawn.player === player}
                  />
                )}
              </Field>
            );
          })
        )}
      </div>
      {/* <div
        style={
          color ? { height: 50, width: 50, backgroundColor: "red" } : undefined
        }
      ></div> */}

      <div
        className={clsx(
          GAME_PROPS.COLOR[player],
          "rounded-full h-12 w-12 mt-2"
        )}
      />
    </>
  );
}
