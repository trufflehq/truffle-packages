import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import AdminDashboard from "../admin-dashboard/admin-dashboard.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";
import styleSheet from "./admin.scss.js";
function ExtensionMapping() {
  useEffect(() => {
    const style = {
      width: "400px",
      height: "400px",
      background: "#fff",
      position: "fixed",
      bottom: 0,
      left: "400px",
      "z-index": "999",
    };

    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: style },
      ],
    });
  }, []);
  useStyleSheet(styleSheet);

  return (
    <>
      <AdminDashboard />
    </>
  );
}

export default ExtensionMapping;
