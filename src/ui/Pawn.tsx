import clsx from "clsx";
import type { Pawn, Position } from "../types/types";
import { MouseEvent } from "react";

export function Pawn({
  clicked,
  color,
  onClick,
  position,
  canClick,
}: Pick<Pawn, "color" | "position"> & {
  clicked: boolean;
  onClick?: (e: MouseEvent, position: Position) => void;
  canClick: boolean;
}) {
  return (
    <div
      onClick={(e) => onClick?.(e, position)}
      className={clsx(
        {
          "cursor-pointer": canClick,
        },
        clicked ? "bg-pink-500" : color,
        `rounded-full h-full w-full`
      )}
    ></div>
  );
}
