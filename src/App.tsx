import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/Button";
import { Icons } from "./components/Icon";
import { cursorPosition, getCurrentWindow } from "@tauri-apps/api/window";
import { resizeButtonGrid } from "./utils/resize-window";

function App() {
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [winCoord, setWinCoord] = useState({ x: 0, y: 0 });
  const localCoord = {
    x: coord.x - winCoord.x,
    y: coord.y - winCoord.y,
  };

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
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "row", gap: "9px" }}
          >
            {[...Array(5)].map((_, j) => (
              <Button
                key={i * 5 + j}
                onClick={() => resizeButtonGrid(5, 5)}
                currentMouseX={localCoord.x}
                currentMouseY={localCoord.y}
              >
                <Icons.closeMac />
              </Button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
