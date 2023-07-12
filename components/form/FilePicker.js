import React from "react";
import classes from "./FilePicker.module.css";
function FilePicker({ name, file, setFile }) {
  function dropFileHandler(e) {
    e.preventDefault();
    setFile(e.dataTransfer.files);
  }

  return (
    <>
      <label
        htmlFor={name}
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
        name={name}
        id={name}
        multiple
        hidden
        onChange={(e) => setFile(e.target.files)}
        onClick={(e) => (e.target.value = "")}
      ></input>
    </>
  );
}

export default FilePicker;
