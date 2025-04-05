import { GAME_PROPS } from "../config";
import { Pawn, Position } from "../types/types";
import { move } from "./utils";

export function createPawn(
  player: 1 | 2 = 1,
  fieldId: number,
  position: Position
): Pawn {
  return {
    color: GAME_PROPS.COLOR[player],
    player,
    id: Math.random(),
    clicked: false,
    possibleMoves: [],
    fieldId,
    move,
    position,
  };
}
