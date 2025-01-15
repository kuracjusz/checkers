import { useRef, useState } from "react";
import { GAME_PROPS } from "../config";
import { BasicProperties, Player } from "../types/types";
import { getFields } from "../utils/utils";
import { Pawn } from "../ui/Pawn";
import { Field } from "../ui/Field";
import clsx from "clsx";
import { computerMove } from "../computer/computer";

export default function Board() {
  const [color, setColor] = useState(false);
  const [player, setPlayer] = useState<Player>(2);
  const [fields, setFields] = useState(getFields(GAME_PROPS.BOARD_FIELDS));
  const clickedPawn = useRef<number>();

  function getPossibleFields<T extends BasicProperties>(this: T) {
    // console.log(this);
  }

  const pawnHandler = (id: number) => {
    setFields((f) => [
      ...f.map((field) => {
        if (!field.pawn) return field;
        field.pawn.clicked = false;
        if (field.pawn.player !== player || field.pawn?.id !== id) return field;
        if (id === field.pawn.id) {
          for (const field of fields) {
            field.framed = false;
          }
          const possibleMoves = [];
          for (const move of field.pawn.getPawnPossibleMoves(f, field.id)) {
            fields[move.move].framed = true;
            possibleMoves.push(move);
          }

          field.pawn.possibleMoves = possibleMoves;
          field.pawn.clicked = true;

          getPossibleFields.call(field);
        }
        return field;
      }),
    ]);
  };

  const fieldHandler = (id: number) => {
    if (id === 63) {
      setTimeout(() => setColor(!color), 2000);
    }
    if (fields[id].pawn && fields[id].pawn.player === player) {
      clickedPawn.current = fields[id].pawn.id;
      return;
    }

    const fieldId = fields.find(
      (field) => field.pawn?.id === clickedPawn.current
    )?.id;
    if (
      !fields[id].framed ||
      (fieldId && fields[fieldId].pawn?.player !== player)
    ) {
      return;
    }

    setFields((fields) => {
      const prevPawn = fields.find(
        (field) => field.pawn?.id === clickedPawn.current
      )?.pawn;

      if (!prevPawn?.move) return fields;

      const { playerAfterMove } = prevPawn.move(player, id, fields);

      return [...fields];
    });

    if (player === 2) {
      setTimeout(() => {
        const { playerNext } = computerMove(setFields);
        setPlayer(playerNext);
      }, 200);
    }
  };

  return (
    <>
      <div className="grid-cols-8 grid w-full">
        {fields.map((field) => {
          return (
            <Field
              key={field.id}
              onClick={() => fieldHandler(field.id)}
              {...field}
            >
              {field.pawn && (
                <Pawn
                  id={field.pawn.id}
                  color={field.pawn.color}
                  onClick={
                    field.pawn.player === player ? pawnHandler : undefined
                  }
                  clicked={field.pawn.clicked}
                />
              )}
            </Field>
          );
        })}
      </div>
      <div
        style={
          color ? { height: 50, width: 50, backgroundColor: "red" } : undefined
        }
      ></div>

      <div
        className={clsx(
          GAME_PROPS.COLOR[player],
          "rounded-full h-12 w-12 mt-2"
        )}
      />
    </>
  );
}
