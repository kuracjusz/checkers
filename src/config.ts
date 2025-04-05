import { Player } from "./types/types";

const COLOR: Record<Player, string> = {
  1: "bg-green-700",
  2: "bg-white",
};

export const GAME_PROPS = {
  BOARD_FIELDS: 8,
  PAWN_LINES: 3,
  PLAYERS: 2,
  COLOR,
};
