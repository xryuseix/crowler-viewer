import { useCallback, useEffect, useState } from "react";
import { GetScreenShotPaths, Logging } from "../wailsjs/go/main/App";
import "./App.css";

function App() {
  const [ssPaths, setSSpaths] = useState<string[]>([]);
  const [ssIdx, setSSIdx] = useState(0);

  useEffect(() => {
    GetScreenShotPaths().then(setSSpaths).catch(console.error);
  }, []);

  const prev = useCallback(() => {
    Logging(`ssIdx: ${ssIdx}, ssPaths.length: ${ssPaths.length}`);
    if (ssPaths.length === 0) {
      return;
    }
    if (ssIdx - 1 < 0) {
      setSSIdx(ssPaths.length - 1);
    } else {
      setSSIdx(ssIdx - 1);
    }
  }, [ssIdx, ssPaths.length]);

  const next = useCallback(() => {
    Logging(`ssIdx: ${ssIdx}, ssPaths.length: ${ssPaths.length}`);
    if (ssIdx + 1 >= ssPaths.length) {
      setSSIdx(0);
    } else {
      setSSIdx(ssIdx + 1);
    }
  }, [ssIdx, ssPaths.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        next();
      } else if (event.key === "ArrowLeft") {
        prev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [prev, next]);


  return (
    <div id="App">
      {ssPaths.length > 0 && ssIdx < ssPaths.length && (
        <img
          id="image"
          src={`/images/${ssPaths[ssIdx]}`}
          style={{ width: "80vw" }}
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
