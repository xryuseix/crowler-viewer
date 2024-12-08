import { useCallback, useEffect, useState } from "react";
import { GetScreenShotPaths, SaveSSPath } from "../wailsjs/go/main/App";
import toast, { Toaster } from "react-hot-toast";
import ReactLoading from "react-loading";
import "./App.css";

function App() {
  const [ssPaths, setSSpaths] = useState<string[]>([]);
  const [ssIdx, setSSIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    GetScreenShotPaths()
      .then(setSSpaths)
      .catch((err) => {
        notify(`Failed to get screenshot paths: ${err}`, "error");
      });
    setLoading(false);
  }, []);

  const prev = useCallback(() => {
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
    if (ssIdx + 1 >= ssPaths.length) {
      setSSIdx(0);
    } else {
      setSSIdx(ssIdx + 1);
    }
  }, [ssIdx, ssPaths.length]);

  const save = useCallback(() => {
    SaveSSPath(ssPaths[ssIdx])
      .then((savePath) => {
        notify(`Saved successfully to ${savePath}`, "success");
      })
      .catch((err) => {
        notify(`Failed to save screenshot path: ${err}`, "error");
      });
  }, [ssIdx, ssPaths]);

  const notify = (msg: string, status?: "success" | "error") => {
    if (status === "error") {
      toast.error(msg, {
        icon: "❌",
      });
      return;
    }
    if (status === "success") {
      toast(msg, {
        icon: "✅",
      });
      return;
    }
    toast(msg);
  };

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
    <div id="app">
      {loading && (
        <div
          id="loading"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ReactLoading />
        </div>
      )}
      <Toaster position="bottom-right" reverseOrder={false} />
      <div
        id="title"
        style={{ textAlign: "center", overflowWrap: "break-word" }}
      >
        {ssPaths.length > 0 && ssPaths[ssIdx]}
      </div>
      <div id="image">
        {ssPaths.length > 0 && ssIdx < ssPaths.length && (
          <img
            id="image"
            src={`/images${encodeURI(ssPaths[ssIdx])}`}
            style={{ width: "80vw" }}
            alt="screenshot"
          />
        )}
      </div>
      <div id="input" className="input-box">
        <button className="btn" onClick={prev} type="button">
          👈 Prev
        </button>
        <button className="btn" onClick={save} type="button">
          💾 Save
        </button>
        <button className="btn" onClick={next} type="button">
          Next 👉
        </button>
      </div>
    </div>
  );
}

export default App;
