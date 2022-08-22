import { React, toDist } from '../deps.ts'
import Vote from "../components/vote/vote.tsx";

function HomePage() {
  return <Vote />;
}

export default toDist(HomePage, import.meta.url);
