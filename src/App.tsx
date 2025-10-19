import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/Button";
import { Icons } from "./components/Icon";
import { cursorPosition, getCurrentWindow } from "@tauri-apps/api/window";
import { resizeButtonGrid } from "./utils/resize-window";

type AtetneState =
  | "START_SCREEN"
  | "CHOOSE_SCREEN"
  | "HUE_GUESS_1"
  | "MINESWEEPER_1"
  | "BAD_APPLE_1"
  | "CREDITS";

const initialState: AtetneState = "START_SCREEN";

function App() {
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [winCoord, setWinCoord] = useState({ x: 0, y: 0 });
  const localCoord = {
    x: coord.x - winCoord.x,
    y: coord.y - winCoord.y,
  };

  const [atetneState, setAtetneState] = useState(initialState);

  useEffect(() => {
    if (atetneState === "CHOOSE_SCREEN") {
      resizeButtonGrid(5, 5, false);
    }
  }, [atetneState]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await invoke("greet", { name: localCoord.x.toString() });
  }

  useEffect(() => {
    const id = setInterval(async () => {
      const scale = await getCurrentWindow().scaleFactor();
      const pos = (await cursorPosition()).toLogical(scale);
      const win = (await getCurrentWindow().outerPosition()).toLogical(scale);
      setCoord({ x: pos.x, y: pos.y });
      setWinCoord({ x: win.x, y: win.y });
    }, 10);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <main className="container">
      {atetneState === "CHOOSE_SCREEN" && (
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "row", gap: "9px" }}
          >
            {[...Array(5)].map((_, j) => (
              <Button
                key={i * 5 + j}
                currentMouseX={localCoord.x}
                currentMouseY={localCoord.y}
              >
                <Icons.closeMac />
              </Button>
            ))}
          </div>
        ))}
      </div>
      )}
      {(atetneState === "START_SCREEN" && (
        <>
          <h1>Let's Start!</h1>
          <button onClick={() => {setAtetneState("CHOOSE_SCREEN")}}>Click</button>
        </>
      ))}
    </main>
  );
}

export default App;
