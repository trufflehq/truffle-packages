import React from "https://npm.tfl.dev/react";
import { Link } from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
import Home from "../../components/home/home.tsx";

export default function Layout({ children }) {
  return (
    <>
      <Link to="/nested-example/a">A</Link>
      <Link to="/nested-example/something">Something</Link>
      nested ex {Math.random()}
      {children}
    </>
  );
}
