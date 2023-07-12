import { useRef, useState } from "react";
import axios from "axios";
import classes from "../styles/Home.module.css";
import fileDownload from "js-file-download";
import FilePicker from "@/components/form/FilePicker";

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
    await axios
      .post("/api/rename", data, {
        onUploadProgress: (uploadProgress) => {},
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, "loveyou.zip");
        oldTextRef.current.value = "";
        newTextRef.current.value = "";
        setFile(undefined);
        setDone(true);
      })
      .catch((err) => {
        console.log(err.message);
        setDone(true);
      });
  }
  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={uploadHandler}>
        <FilePicker name="fileRename" setFile={setFile} file={file} />
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
            RENAME
          </button>
        ) : (
          <button type="submit" className={classes.renameButton} disabled>
            RENAME
          </button>
        )}
      </form>
    </div>
  );
}

export default Home;
