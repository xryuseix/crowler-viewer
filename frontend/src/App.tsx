import { useEffect, useState } from "react";
import "./App.css";
import { GetScreenShotPaths } from "../wailsjs/go/main/App";

function App() {
  const [ssPaths, setSSpaths] = useState<string[]>([]);
  const [ssIdx, setSSIdx] = useState(0);

  useEffect(() => {
    GetScreenShotPaths().then(setSSpaths).catch(console.error);
  }, []);

  const prev = () => {
    if (ssIdx - 1 < 0) {
      setSSIdx(ssPaths.length - 1);
    } else {
      setSSIdx(ssIdx - 1);
    }
  };

  const next = () => {
    if (ssIdx + 1 >= ssPaths.length) {
      setSSIdx(0);
    } else {
      setSSIdx(ssIdx + 1);
    }
  };

  return (
    <div id="App">
      {ssPaths.length > 0 && ssIdx < ssPaths.length && (
        <img
          id="image"
          src={`/images/${ssPaths[ssIdx]}`}
          style={{ width: "300px" }}
          alt="app icon"
        />
      )}
      <div id="input" className="input-box">
        <button className="btn" onClick={prev} type="button">
          Prev
        </button>
        <button className="btn" onClick={next} type="button">
          Next
        </button>
      </div>
      <div id="result" className="result">
        {ssPaths.map((path) => (
          <p key={path}>{path}</p>
        ))}
      </div>
      <p>idx: {ssIdx}</p>
    </div>
  );
}

export default App;
