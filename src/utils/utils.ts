import { GAME_PROPS } from "../config";
import { Field, Pawn, Player, Position } from "../types/types";
import { createPawn } from "./PawnUtils";

const pawnFactory = () => {
  const basePawnN =
    (GAME_PROPS.PLAYERS * GAME_PROPS.PAWN_LINES * GAME_PROPS.BOARD_FIELDS) / 2;
  let pawnsNumber = basePawnN;
  return {
    ifFieldWithPawn: (
      id: number,
      isFieldValid: boolean,
      { x, y }: Position
    ) => {
      const player = pawnsNumber > basePawnN / 2 ? 1 : 2;
      const firstPalyexMaxId = GAME_PROPS.PAWN_LINES * GAME_PROPS.BOARD_FIELDS;
      const secondPlayerMinId =
        GAME_PROPS.BOARD_FIELDS * (GAME_PROPS.PLAYERS + GAME_PROPS.PAWN_LINES);

      if (
        isFieldValid &&
        pawnsNumber > 0 &&
        (id < firstPalyexMaxId || id > secondPlayerMinId)
      ) {
        pawnsNumber--;
        return createPawn(player, id, { x, y });
      }
      return null;
    },
  };
};

export function createFields(fieldsNumber: number): Field[][] {
  const board: Field[][] = Array.from({ length: fieldsNumber }, () =>
    Array.from({ length: fieldsNumber })
  );

  const createdPawns = pawnFactory();

  for (let i = 0; i < fieldsNumber; i++) {
    for (let j = 0; j < fieldsNumber; j++) {
      const firstColor = (i + j) % 2 === 0;

      const pawn = createdPawns.ifFieldWithPawn(
        j + i * fieldsNumber,
        firstColor,
        { x: j, y: i }
      );

      const rawField = {
        color: firstColor ? "bg-blue-900" : "bg-blue-300",
        id: j + i * fieldsNumber,
        enabled: firstColor,
      };

      board[i][j] = {
        position: { x: j, y: i },
        pawn: pawn ? { ...pawn } : null,
        ...rawField,
      };
    }
  }

  return board;
}

export function move(
  this: Pawn,
  changedFields: Field[][],
  position: Position | undefined
) {
  if (!position) return;
  const { x, y } = position;
  const { y: clickedPawnY, x: clickedPawnX } = this.position;
  const xDimensionSign = x > clickedPawnX ? 1 : -1;
  const yDimensionSign = this.player === 1 ? 1 : -1;

  if (
    changedFields[clickedPawnY + yDimensionSign][clickedPawnX + xDimensionSign]
      .pawn
  ) {
    changedFields[clickedPawnY + yDimensionSign][
      clickedPawnX + xDimensionSign
    ].pawn = null;
  }

  changedFields[y][x].pawn = this;
  changedFields[y][x].pawn.position = { x, y };
  changedFields[clickedPawnY][clickedPawnX].pawn = null;
}

export function pawnModificator<Key extends keyof Pawn>(
  fields: Field[][],
  modificator: { [k in Key]: Pawn[k] }
) {
  const [key, value] = Object.entries(modificator)[0] as [Key, Pawn[Key]];

  fields.forEach((y) =>
    y.forEach((x) => {
      if (x.pawn) {
        x.pawn[key] = value;
      }
    })
  );
}

export function fieldModificator<Key extends keyof Field>(
  fields: Field[][],
  modificator: { [k in Key]: Field[k] }
) {
  const [key, value] = Object.entries(modificator)[0] as [Key, Field[Key]];

  fields.forEach((y) =>
    y.forEach((x) => {
      x[key] = value;
    })
  );
}

function getNextMove(
  changedFields: Field[][],
  move: number,
  sign: 1 | -1,
  { x, y }: Position
) {
  return changedFields[y - move * sign]?.[x + move];
}

function getPossibleMoves(
  changedFields: Field[][],
  player: Player,
  { x, y }: Position
) {
  const sign = player === 2 ? -1 : 1;
  const moves = [-1, 1];
  const nextMoves: Field[] = [];

  // logic for move
  // queen moves
  // let i = 1;
  // while (x - i >= 0) {
  //   if (fields[y - i][x - i].pawn) {
  //     fields[y - i][x - i].framed = true;
  //   }
  //   i += 1;
  // }

  moves.forEach((move) => {
    const nextMove = changedFields[y + 1 * sign]?.[x + move];

    const ifCanJump =
      nextMove?.pawn && !changedFields[y + 2 * sign]?.[x + 2 * move]?.pawn;
    const ifNotPawnOnWay = !nextMove?.pawn;
    const isBlocked = nextMove?.pawn?.player === player;

    if (ifCanJump && !isBlocked) {
      nextMoves.push(changedFields[y + 2 * sign]?.[x + 2 * move]);
      return { isJumping: true, nextMoves };
    }

    if (ifNotPawnOnWay) {
      nextMoves.push(nextMove);
    }
  });

  return { isJumping: false, nextMoves };
}

export const selectNextMoves = (
  changedFields: Field[][],
  { x, y }: Position,
  player: Player,
  selectFrame = true
) => {
  if (!changedFields[y][x].pawn) return { nextPositions: [], isJumping: false };
  const { isJumping, nextMoves } = getPossibleMoves(changedFields, player, {
    x,
    y,
  });

  const nextPositions = nextMoves.map((move) => {
    if (!move) return;
    if (selectFrame) {
      move.framed = true;
    }
    return move.position;
  });

  changedFields[y][x].pawn.possibleMoves = nextPositions;

  return { nextPositions, isJumping };
};
