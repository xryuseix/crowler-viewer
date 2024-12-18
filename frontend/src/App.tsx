import { useCallback, useEffect, useState } from "react";
import {
  GetScreenShotPaths,
  SaveSSPath,
  DeletePhishData,
} from "../wailsjs/go/main/App";
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
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        notify(`Failed to get screenshot paths: ${err}`, "error");
      });
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

  const deletePhish = useCallback(() => {
    const path = ssPaths[ssIdx];
    const pathTrimed = path.split("/")[path.split("/").length - 2];
    if (typeof path === "undefined") {
      return;
    }
    DeletePhishData(path)
      .then(() => {
        notify(`Deleted ${pathTrimed}`, "success");
      })
      .catch((err) => {
        notify(`Failed to delete phish data: ${err}`, "error");
      });
    next();
  }, [ssIdx, ssPaths, next]);

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
      } else if (event.key === "s") {
        save();
      } else if (event.key === "d") {
        deletePhish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [prev, next, save, deletePhish]);

  if (loading) {
    return (
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
    );
  }

  return (
    <div id="app">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div id="title" style={{ textAlign: "center", overflowWrap: "anywhere" }}>
        <span style={{ marginRight: "5px" }}>
          [{ssIdx}/{ssPaths.length}]
        </span>
        <span>{ssPaths[ssIdx]}</span>
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
        <button className="btn" onClick={deletePhish} type="button">
          ❌ Delete
        </button>
        <button className="btn" onClick={next} type="button">
          Next 👉
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="number"
          value={ssIdx}
          onChange={(e) => {
            const idx = Number.parseInt(e.target.value);
            if (Number.isNaN(idx)) {
              return;
            }
            if (idx < 0) {
              setSSIdx(0);
              return;
            }
            if (idx >= ssPaths.length) {
              setSSIdx(ssPaths.length - 1);
              return;
            }
            setSSIdx(Number.parseInt(e.target.value));
          }}
        />
      </div>
    </div>
  );
}

export default App;
