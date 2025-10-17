import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/Button";
import { Icons } from "./components/Icon";
import { cursorPosition, getCurrentWindow, primaryMonitor } from "@tauri-apps/api/window";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [coord, setCoord] = useState({x: 0, y: 0});
  const [winCoord, setWinCoord] = useState({x: 0, y: 0});
  const localCoord = {
    x: (coord.x - winCoord.x),
    y: (coord.y - winCoord.y),
  };

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    const id = setInterval(async () => {
      const scale = await getCurrentWindow().scaleFactor();
      const pos = (await cursorPosition()).toLogical(scale);
      const win = (await getCurrentWindow().outerPosition()).toLogical(scale);
      setCoord({x: pos.x, y: pos.y});
      setWinCoord({x: win.x, y: win.y});
    }, 10);

    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <main className="container">
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "row", gap: "9px" }}>
            {[...Array(5)].map((_, j) => (
              <Button key={i * 5 + j} onClick={() => greet()} currentMouseX={localCoord.x} currentMouseY={localCoord.y}>
                <Icons.closeMac width={8} height={8} />
              </Button>
            ))}
          </div>
        ))}
      </div>
      <h1>Welcome to Tauri + React</h1>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <p>Coordinates: X: ${coord.x} Y: ${coord.y}</p>
      <p>Window: X: ${winCoord.x} Y: ${winCoord.y}</p>
      <p>Local: X: ${localCoord.x} Y: ${localCoord.y}</p>

      <input
        id="greet-input"
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Enter a name..."
      />
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
