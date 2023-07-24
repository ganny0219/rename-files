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

  const loadCtx = useContext(LoadingContext);

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
    loadCtx.setLoad(true);
    await axios
      .post("https://remafi.vercel.app/api/merge-pdf", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      })
      .then((res) => {
        // fileDownload(res.data, "loveyoupdf.zip");
        loadCtx.setLoad(false);
        alert("Check your google grive :)");
        setAddFiles(undefined);
        setListFiles(undefined);
      })
      .catch((error) => {
        loadCtx.setLoad(false);
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
          {!loadCtx.loading ? (
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
