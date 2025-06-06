import { useState } from "react";
import "./App.css";
import Board from "./Board";
import { Menu } from "./Menu";
import { Display } from "./types/types";
import { playersList } from "./Menu/Menu";

function App() {
  const [display, setDisplay] = useState<Display>("menu");
  const [selected, setSelected] = useState(playersList[0]);

  return (
    <>
      <Board onSelect={setDisplay} />;
      {display === "menu" && (
        <Menu
          onSelect={setDisplay}
          setSelected={setSelected}
          selected={selected}
        />
      )}
    </>
  );
}

export default App;
