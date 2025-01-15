import clsx from "clsx";
import { MouseEventHandler } from "react";
import type { Field } from "../types/types";

type FieldProps = Field & {
  onClick: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
};

export function Field({ framed, color, onClick, children }: FieldProps) {
  return (
    <div
      className={clsx(
        color,
        { "border-pink-500 cursor-pointer border-2": framed },
        `p-6 aspect-square`
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
