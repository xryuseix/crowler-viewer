import { useState } from "react";
import "./App.css";
import { Greet } from "../wailsjs/go/main/App";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇",
  );
  const [name, setName] = useState("");
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  function greet() {
    Greet(name).then(updateResultText);
  }

  return (
    <div id="App">
      <img
        src="../downloaded/appicon.png"
        style={{ width: "300px" }}
        alt="app icon"
      />
      <div id="result" className="result">
        {resultText}
      </div>
      <div id="input" className="input-box">
        <input
          id="name"
          className="input"
          onChange={updateName}
          autoComplete="off"
          name="input"
          type="text"
        />
        <button className="btn" onClick={greet} type="button">
          Greet
        </button>
      </div>
    </div>
  );
}

export default App;
