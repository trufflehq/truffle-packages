import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";

import Admin from "../../components/admin/admin.tsx";

function AdminPage() {
  return <Admin />;
}

export default toDist(AdminPage, import.meta.url);
