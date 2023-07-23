import React, { useState } from "react";
import classes from "./MergePdf.module.css";
import FilePicker from "../form/FilePicker";
import axios from "axios";
import fileDownload from "js-file-download";
import { useContext } from "react";
import { LoadingContext } from "@/pages/_app";

function MergePdf() {
  const [listFiles, setListFiles] = useState();
  const [addFiles, setAddFiles] = useState();
  const [done, setDone] = useState(true);

  const loadCtx = useContext(LoadingContext);
  console.log(loadCtx);

  async function mergeHandler(e) {
    e.preventDefault();

    if (!listFiles || !addFiles) {
      return alert("Masukan file yang akan dimerge");
    }

    const data = new FormData();

    for (const addFile of addFiles) {
      data.append("addFiles", addFile);
    }
    for (const listFile of listFiles) {
      data.append("listFiles", listFile);
    }
    setDone(false);
    await axios
      .post("/api/merge-pdf", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((res) => {
        // fileDownload(res.data, "loveyoupdf.zip");
        alert("Check your google grive :)");
        setAddFiles(undefined);
        setListFiles(undefined);
        setDone(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <div className={classes.container}>
        <form className={classes.form} onSubmit={mergeHandler}>
          <h2>List File</h2>
          <FilePicker name="listFile" file={listFiles} setFile={setListFiles} />
          <h2>Add File</h2>
          <FilePicker name="addFile" file={addFiles} setFile={setAddFiles} />
          {done ? (
            <button type="submit" className={classes.renameButton}>
              MERGE
            </button>
          ) : (
            <button type="submit" className={classes.renameButton} disabled>
              MERGE
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default MergePdf;
