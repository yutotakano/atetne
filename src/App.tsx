import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/Button";
import { Icons } from "./components/Icon";
import { cursorPosition, getCurrentWindow } from "@tauri-apps/api/window";
import { resizeButtonGrid, resizeWindow } from "./utils/resize-window";

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
    if (atetneState === "START_SCREEN") {
      resizeWindow(200, 200);
    } else if (atetneState === "CHOOSE_SCREEN") {
      resizeButtonGrid(5, 1);
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
        <div
          style={{ display: "flex", flexDirection: "row", gap: "9px" }}
        >
          <Button
            bg="#ff544d"
            currentMouseX={localCoord.x}
            currentMouseY={localCoord.y}
          >
            <Icons.closeMac />
          </Button>
          <Button
          bg="#ffbd2e"
            currentMouseX={localCoord.x}
            currentMouseY={localCoord.y}
          >
            <Icons.minMac />
          </Button>
          <Button
          bg="#28c93f"
            currentMouseX={localCoord.x}
            currentMouseY={localCoord.y}
          >
            <Icons.fullMac />
          </Button>
          <Button
            bg="#5CC8FF"
            currentMouseX={localCoord.x}
            currentMouseY={localCoord.y}
          >
            <Icons.plusMac />
          </Button>
          <Button
            bg="#E5CEDC"
            currentMouseX={localCoord.x}
            currentMouseY={localCoord.y}
          >
            <Icons.minMac />
          </Button>
        </div>
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
