import React from "react";
import classes from "./Loading.module.css";
function LoadingScreen() {
  return (
    <div className={classes.container}>
      <div className={classes.loadingScreen}>
        Tunggu yah cayang :*
        <div className={classes.loader}></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
