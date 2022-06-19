import React from "react";
import { Link } from "wouter";
import Home from "../../components/home/home.tsx";

export default function Layout({ children }) {
  return (
    <>
      <Link href="/a">A</Link>
      <Link href="/something">Something</Link>
      nested ex {Math.random()}
      {children}
    </>
  );
}
