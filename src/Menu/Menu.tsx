import clsx from "clsx";
import { Display, PlayerList } from "../types/types";
import { useEffect } from "react";

const MiniBoard = () => {
  return (
    <div className="grid grid-cols-8 w-28 h-28 m-auto">
      {Array.from({ length: 64 }).map((row, index) => (
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
    <div className="flex flex-col m-auto gap-20 px-20 pt-[9rem] border rounded-2xl min-w-[830px] shadow">
      <MiniBoard />
      <h1
        className={clsx(
          "cursor-pointer",
          selectedComputer ? "opacity-100" : "opacity-50"
        )}
        // onClick={() => onSelect("board")}
      >
        {selectedComputer && "🤖"} Play with computer {selectedComputer && "🤖"}
      </h1>
      <h1
        className={clsx(
          "cursor-not-allowed opacity-10",
          selectedPlayer ? "opacity-100" : "opacity-50"
        )}
        // onClick={() => onSelect("board")}
      >
        {selectedPlayer && "🧑‍🤝‍🧑"} Play with other player {selectedPlayer && "🧑‍🤝‍🧑"}
      </h1>
      <h2 className="mt-[7rem] p-8">⚙️ Settings</h2>
    </div>
  );
};
