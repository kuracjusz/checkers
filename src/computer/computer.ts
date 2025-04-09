import { Field, Pawn } from "../types/types";
import { selectNextMoves } from "../utils/utils";

export function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

export function computerMove(changedFields: Field[][]) {
  const pawnsWitNexthMoves: Pawn[] = [];

  changedFields.forEach((row) => {
    row.forEach((field) => {
      if (field.pawn && field.pawn.player === 1) {
        const { nextPositions } = selectNextMoves(
          changedFields,
          field.pawn.position,
          1,
          false
        );

        if (
          nextPositions.length > 0 &&
          !nextPositions.every((position) => position === undefined)
        ) {
          pawnsWitNexthMoves.push(field.pawn);
        }
      }
    });
  });

  const randomPawn =
    pawnsWitNexthMoves[Math.floor(Math.random() * pawnsWitNexthMoves.length)];
  const possibleMoves = randomPawn.possibleMoves.filter(
    (move) => move !== undefined
  );
  const randomMove = Math.floor(Math.random() * possibleMoves.length);

  randomPawn.move(changedFields, possibleMoves[randomMove]);

  return changedFields;
}
