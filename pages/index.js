import { useRef, useState } from "react";
import axios from "axios";
import classes from "../styles/Home.module.css";
import fileDownload from "js-file-download";

export function Home() {
  const [file, setFile] = useState();
  const [done, setDone] = useState(true);
  const oldTextRef = useRef();
  const newTextRef = useRef();

  async function uploadHandler(e) {
    e.preventDefault();

    if (!file) {
      return alert("Belum Memasukan File!");
    }

    const data = new FormData();
    data.append("oldText", oldTextRef.current.value);
    data.append("newText", newTextRef.current.value);
    for (let i = 0; i < file.length; i++) {
      data.append("files", file[i]);
    }
    setDone(false);
    axios
      .post("/api/upload", data, {
        onUploadProgress: (uploadProgress) => {},
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, "loveyou.zip");
        oldTextRef.current.value = undefined;
        newTextRef.current.value = undefined;
        setFile(undefined);
        setDone(true);
      })
      .catch((err) => {
        console.log(err.message);
        setDone(true);
      });
  }
  console.log(file);
  function dropFileHandler(e) {
    e.preventDefault();
    setFile(e.dataTransfer.files);
  }
  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={uploadHandler}>
        <label
          htmlFor="fileInput"
          onDrop={dropFileHandler}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className={classes.fileInput}>
            {!file ? (
              <div className={classes.fileInputContent}>
                <p>Drag and Drop Files Here</p>
                <p>or</p>
                <div className={classes.fileInputButton}>Browse Files</div>
              </div>
            ) : (
              <div className={classes.ready}>{`Ready :)`}</div>
            )}
          </div>
        </label>
        <input
          type="file"
          name="fileInput"
          id="fileInput"
          multiple
          hidden
          onChange={(e) => setFile(e.target.files)}
        ></input>
        <div className={classes.inputTextContainer}>
          <div className={classes.inputItem}>
            <label htmlFor="oldText">Old Text</label>
            <input
              type="text"
              name="oldText"
              ref={oldTextRef}
              autoComplete="off"
              required
            ></input>
          </div>
          <div className={classes.inputItem}>
            <label htmlFor="newText">New Text</label>
            <input
              type="text"
              name="newText"
              ref={newTextRef}
              autoComplete="off"
              required
            ></input>
          </div>
        </div>
        {done ? (
          <button type="submit" className={classes.renameButton}>
            Rename
          </button>
        ) : (
          <button type="submit" className={classes.renameButton} disabled>
            Rename
          </button>
        )}
      </form>
    </div>
  );
}

export default Home;
