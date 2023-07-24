import { useRef, useState, useContext } from "react";
import axios from "axios";
import classes from "../styles/Home.module.css";
import fileDownload from "js-file-download";
import FilePicker from "@/components/form/FilePicker";
import { LoadingContext } from "./_app";

export function Home() {
  const [file, setFile] = useState();
  const oldTextRef = useRef();
  const newTextRef = useRef();
  const loadCtx = useContext(LoadingContext);
  console.log(process.env.CREDEN);
  console.log(process.env.DRIVE_ID);
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
    loadCtx.setLoad(true);

    await axios
      .post("https://remafi.vercel.app/api/rename", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((res) => {
        // fileDownload(res.data, "loveyou.zip");
        loadCtx.setLoad(false);
        alert("Check your google drive :)");
        oldTextRef.current.value = "";
        newTextRef.current.value = "";
        setFile(undefined);
      })
      .catch((err) => {
        loadCtx.setLoad(false);
        console.log(err.message);
      });
  }
  return (
    <>
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
          {!loadCtx.loading ? (
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
    </>
  );
}

export default Home;
