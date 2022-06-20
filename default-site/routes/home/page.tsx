import React from "react";
import Home from "../../components/home/home.tsx";
import { gql, useQuery } from "https://tfl.dev/@truffle/api@0.0.1/client.js";

const query = gql`{ time }`;

export default function HomePage() {
  console.log("qq");

  const [result] = useQuery({ query });
  console.log("res", result);

  return (
    <>
      HOme...
      {/* <Home /> */}
    </>
  );
}
