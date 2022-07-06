import React from "https://npm.tfl.dev/react";

export default function NestedExampleLayout({ children }) {
  return (
    <>
      This is a layout that applies to all nested children
      {children}
    </>
  );
}
