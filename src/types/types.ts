export type BasicProperties = {
  color: string;
  id: number;
  position: Position;
};

export type Field =
  | {
      enabled: boolean;
      framed?: boolean;
    } & BasicProperties &
      (
        | {
            pawn?: null;
          }
        | {
            pawn: Pawn;
          }
      );

export type Player = 1 | 2;

export type Pawn = BasicProperties & {
  player: Player;
  possibleMoves: Partial<Position[]>;
  clicked: boolean;
  fieldId: number;
  move(changedFields: Field[][], position: Position | undefined): void;
};

export type PositionNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Position = { x: number; y: number };

export type Display = "menu" | "board";
export type PlayerList = "computer" | "player";
