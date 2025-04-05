import { Field, Pawn, Player } from "../types/types";
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
        // console.log("nextPositions", field.pawn);

        if (nextPositions.length > 0) {
          pawnsWitNexthMoves.push(field.pawn);
        }
      }
    });
  });

  const randomPawn =
    pawnsWitNexthMoves[Math.floor(Math.random() * pawnsWitNexthMoves.length)];
  const randomMove = Math.floor(
    Math.random() * randomPawn.possibleMoves.length
  );

  randomPawn.move(changedFields, randomPawn.possibleMoves[randomMove]);

  // console.log(pawnsWitNexthMoves);

  return changedFields;
}
