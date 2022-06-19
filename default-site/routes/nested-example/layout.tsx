import React from "react";
import { Link } from "react-router-dom";
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
