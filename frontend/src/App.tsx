import { useState } from "react";
import "./App.css";
import { GetScreenShotPaths } from "../wailsjs/go/main/App";

function App() {
  const [resultText, setResultText] = useState([""]);
  const updateResultText = (result: string[]) => setResultText(result);

  function greet() {
    GetScreenShotPaths().then(updateResultText).catch(console.error);
  }

  return (
    <div id="App">
      {/* <img
        src="../downloaded/appicon.png"
        style={{ width: "300px" }}
        alt="app icon"
      /> */}
      <div id="result" className="result">
        {resultText.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
      <div id="input" className="input-box">
        <button className="btn" onClick={greet} type="button">
          Greet
        </button>
      </div>
    </div>
  );
}

export default App;
