import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/Button";
import { Icons } from "./components/Icon";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <div style={{ display: "flex", flexDirection: "row", gap: "9px" }}>
      <Button onClick={() => greet()}>
        <Icons.minMac width={8} height={8} />
      </Button>
      <Button onClick={() => greet()}>
        <Icons.fullMac width={6} height={6} />
      </Button>
      <Button onClick={() => greet()}>
        <Icons.closeMac width={8} height={8} />
      </Button>
      </div>
      <h1>Welcome to Tauri + React</h1>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

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
