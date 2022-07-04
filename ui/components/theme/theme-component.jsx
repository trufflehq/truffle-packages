import React from "https://npm.tfl.dev/react";

export default function ThemeComponent() {
  return (
    <>
      <link rel="stylesheet" href={new URL("./variables.css", import.meta.url)} />
      <style>{`
        :root {
          background: var(--tfl-color-bg-fill);
          color: var(--tfl-color-on-bg-fill);
          font-family: var(--tfl-font-family-body-sans);
        }
      `}</style>

      {/* TODO: specify this somewhere else */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
