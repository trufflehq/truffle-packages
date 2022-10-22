import React, { useEffect } from "https://npm.tfl.dev/react";
import { useParams } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

function MyVarPage() {
  const params = useParams();

  useEffect(() => {
    console.log("effect");
    return () => {
      console.log("rm effect");
    };
  }, []);

  return (
    <div>
      Page with variable route: {JSON.stringify(params)}
    </div>
  );
}

export default toDist(MyVarPage, import.meta.url);
