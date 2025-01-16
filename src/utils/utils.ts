import { GAME_PROPS } from "../config";
import { Field, Pawn, Player } from "../types/types";

const pawnGetter = () => {
  const basePawnN =
    (GAME_PROPS.PLAYERS *
      GAME_PROPS.PAWN_LINES *
      Math.sqrt(GAME_PROPS.BOARD_FIELDS)) /
    2;
  let pawnsNumber = basePawnN;

  return {
    ifPawn: (id: number, isValid: boolean) => {
      const player = pawnsNumber > basePawnN / 2 ? 1 : 2;

      if (isValid && pawnsNumber > 0 && (id < 3 * 8 || id > 3 * 8 + 2 * 8)) {
        pawnsNumber--;
        return createPawn(player, id);
      }
      return null;
    },
  };
};

export function getFields(fieldsNumber: number): Field[] {
  const fieldsLine = Math.sqrt(fieldsNumber);
  const board: Field[] = [];
  const pawnG = pawnGetter();

  for (let i = 0; i < fieldsLine; i++) {
    for (let j = 0; j < fieldsLine; j++) {
      const firstColor = (i + j) % 2 === 0;
      const pawn = pawnG.ifPawn(j + i * fieldsLine, firstColor);
      const rawField = {
        color: firstColor ? "bg-blue-900" : "bg-blue-300",
        id: j + i * fieldsLine,
        enabled: firstColor,
        move,
      };

      if (pawn) {
        board.push({
          pawn,
          ...rawField,
        });
      } else {
        board.push({
          ...rawField,
        });
      }
    }
  }

  return board;
}

export function getPawnPossibleMoves(
  fields: Field[],
  fieldId: number,
  player: 1 | 2
) {
  const checkIfFieldIsEnabled = (id: Field["id"]) => fields[id].enabled;

  const pawnMoves = player === 1 ? [7, 9] : [-7, -9];

  const pMoves: { fieldIdWithPawnToDestroy?: number; move: number }[] = [];
  let hasPawnOnMove = false;

  pawnMoves.forEach((move) => {
    const nextId = fieldId + move;
    if (!(fieldId + move >= 0 && fieldId + move < 64)) return;
    if (fields[nextId].pawn) {
      if (
        fieldId + move * 2 >= 0 &&
        fieldId + move * 2 < 64 &&
        !fields[fieldId + move * 2]?.pawn &&
        checkIfFieldIsEnabled(fieldId + move * 2)
      )
        if (player !== fields[nextId].pawn.player) {
          pMoves.push({
            fieldIdWithPawnToDestroy: nextId,
            move: fieldId + move * 2,
          });
          hasPawnOnMove = true;
        }
    } else if (!hasPawnOnMove) {
      if (checkIfFieldIsEnabled(nextId)) {
        pMoves.push({
          move: nextId,
        });
      }
    }
  });

  return pMoves;
}

export function createPawn(player: 1 | 2 = 1, fieldId: number): Pawn {
  return {
    move: move,
    getPawnPossibleMoves: (fields, fieldId) =>
      getPawnPossibleMoves(fields, fieldId, player),
    color: GAME_PROPS.COLOR[player],
    player,
    id: Math.random(),
    clicked: false,
    possibleMoves: [],
    fieldId,
  };
}

function move(this: Pawn, player: Player, id: number, fields: Field[]) {
  console.log(id);
  const fieldIdWithPawnToDestroy = checkIfDestroy(this);
  fields[this.fieldId].pawn = null;
  this.fieldId = id;
  fields[id].pawn = this;

  fields[id].pawn?.possibleMoves.forEach((move) => {
    fields[move.move].framed = false;
  });

  if (fieldIdWithPawnToDestroy) {
    fields[fieldIdWithPawnToDestroy].pawn = null;
  }

  this.clicked = false;

  return {
    playerAfterMove: player === 1 ? 2 : 1,
  } satisfies { playerAfterMove: Player };
}

function checkIfDestroy(pawn: Pawn) {
  return pawn?.possibleMoves.find((move) => {
    if (move.fieldIdWithPawnToDestroy) {
      return move.fieldIdWithPawnToDestroy;
    }
  })?.fieldIdWithPawnToDestroy;
}
