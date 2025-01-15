import clsx from "clsx";
import { IPawn } from "../types/types";

export function Pawn({
  clicked,
  color,
  onClick,
  id,
}: Pick<IPawn, "id" | "color"> & {
  clicked: boolean;
  onClick?: (id: number) => void;
}) {
  return (
    <div
      onClick={() => onClick?.(id)}
      className={clsx(
        {
          "cursor-pointer": onClick,
        },
        clicked ? "bg-pink-500" : color,
        `rounded-full h-full w-full`
      )}
    ></div>
  );
}
