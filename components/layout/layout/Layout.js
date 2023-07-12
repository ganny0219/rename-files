import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classes from "./Layout.module.css";
function Layout({ children }) {
  const router = useRouter();
  const url = router.pathname;
  return (
    <div>
      <nav className={classes.navigation}>
        <h1 className={classes.logo}>REMAFI</h1>
        <ul className={classes.list}>
          <li className={classes.listItem}>
            <Link
              className={url == "/" ? classes.activePage : ""}
              href={{ pathname: "/" }}
            >
              RENAME
            </Link>
          </li>
          <li className={classes.listItem}>
            <Link
              className={url == "/merge-pdf" ? classes.activePage : ""}
              href={{ pathname: "/merge-pdf" }}
            >
              MERGE PDF
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}

export default Layout;
