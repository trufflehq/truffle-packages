import { React, toDist } from '../../deps.ts'
import AdminLite from "../../components/admin-lite/admin-lite.tsx"

function AdminLitePage() {
  return (
    <>
      <head>
      </head>
      <div className="p-admin-lite-page">
        <AdminLite />
      </div>
    </>
  );
}

export default toDist(AdminLitePage, import.meta.url);
