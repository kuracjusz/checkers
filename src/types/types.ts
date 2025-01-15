export type BasicProperties = {
  color: string;
  id: number;
};

export type Field =
  | {
      enabled: boolean;
    } & BasicProperties &
      (
        | {
            pawn?: null;
            framed?: false;
          }
        | {
            pawn?: null;
            framed: true;
          }
        | {
            pawn: Pawn;
            framed?: false;
          }
      );

export type Player = 1 | 2;

export type Pawn = BasicProperties & {
  player: Player;
  possibleMoves: { fieldIdWithPawnToDestroy?: number; move: number }[];
  getPawnPossibleMoves: (
    fields: Field[],
    fieldId: number
  ) => { fieldIdWithPawnToDestroy?: number; move: number }[];
  move: (
    player: Player,
    id: number,
    fields: Field[]
  ) => { playerAfterMove: Player };
  clicked: boolean;
  fieldId: number;
};
