import clsx from "clsx";
import { Display, PlayerList } from "../types/types";
import { useEffect } from "react";

const MiniBoard = () => {
  return (
    <div className="grid grid-cols-8 w-28 h-28 m-auto">
      {Array.from({ length: 64 }).map((_, index) => (
        <div
          key={index}
          className={`${
            Math.floor(index / 8 + index) % 2 ? "bg-blue-300" : "bg-blue-900"
          }`}
        ></div>
      ))}
    </div>
  );
};

export const playersList: PlayerList[] = ["computer", "player"];

type MenuProps = {
  onSelect(display: Display): void;
  setSelected(selected: PlayerList): void;
  selected: PlayerList;
};

export const Menu = ({ onSelect, setSelected, selected }: MenuProps) => {
  const selectedComputer = selected === "computer";
  const selectedPlayer = selected === "player";

  useEffect(() => {
    const arrowEvent = (e: KeyboardEvent) => {
      let index = playersList.indexOf(selected);
      if (e.key === "ArrowDown") {
        setSelected(
          playersList[
            index < playersList.length - 1 ? ++index : playersList.length - 1
          ]
        );
      }
      if (e.key === "ArrowUp") {
        setSelected(playersList[index > 0 ? --index : 0]);
      }
      if (e.key === "Enter" && selectedComputer) {
        onSelect("board");
      }
      if (e.key === "Backspace") {
        onSelect("menu");
      }
    };
    document.addEventListener("keydown", arrowEvent);

    return () => document.removeEventListener("keydown", arrowEvent);
  }, [selectedComputer, onSelect, setSelected, selected]);

  return (
    <div className="fixed backdrop-blur-sm w-full h-full flex">
      <div className="flex flex-col m-auto gap-10 p-10 pt-[6rem] bg-[#1a1a1a] rounded-2xl w-min min-w-[630px] shadow">
        <MiniBoard />
        <h1
          className={clsx(
            "text-4xl",
            "cursor-pointer",
            selectedComputer ? "opacity-100" : "opacity-50"
          )}
          onClick={() => onSelect("board")}
        >
          {selectedComputer && "🤖"} Play with computer{" "}
          {selectedComputer && "🤖"}
        </h1>
        <h1
          className={clsx(
            "text-4xl",
            "cursor-not-allowed opacity-10",
            selectedPlayer ? "opacity-100" : "opacity-50"
          )}
          // onClick={() => onSelect("board")}
        >
          {selectedPlayer && "🧑‍🤝‍🧑"} Play with other player{" "}
          {selectedPlayer && "🧑‍🤝‍🧑"}
        </h1>
        <h2 className="mt-[7rem] p-8">⚙️ Settings</h2>
      </div>
    </div>
  );
};
