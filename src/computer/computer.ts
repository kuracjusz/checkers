import { Dispatch, SetStateAction } from "react";
import { Field, Player } from "../types/types";

export function computerMove(setFields: Dispatch<SetStateAction<Field[]>>) {
  const pawnsThatCouldMove: number[] = [];
  let hasMoves = false;

  setFields((fields) => {
    if (hasMoves) return fields;

    fields.forEach((field) => {
      if (!field.pawn || field.pawn.player === 2) return;

      const possibleMoves = field.pawn?.getPawnPossibleMoves(fields, field.id);
      if (possibleMoves.length > 0) {
        pawnsThatCouldMove.push(field.id);
      }
    });

    hasMoves = true;

    // console.log(pawnsThatCouldMove, fields[pawnsThatCouldMove[0]].pawn);

    if (pawnsThatCouldMove.length === 0) return fields;

    // const pawn = fields[pawnsThatCouldMove[0]].pawn;

    const pawnNextMoves = [7, 9];
    function move() {
      for (const fieldIdWithPawn of pawnsThatCouldMove) {
        for (let i = 0; i < pawnNextMoves.length; i++) {
          const nextId = fieldIdWithPawn + pawnNextMoves[i];

          if (fields[nextId].enabled && !fields[nextId].pawn) {
            fields[fieldIdWithPawn].pawn?.move(1, nextId, fields);
            return;
          }
        }
      }
    }

    move();

    return [...fields];
  });

  return { playerNext: 2 } satisfies { playerNext: Player };
}
