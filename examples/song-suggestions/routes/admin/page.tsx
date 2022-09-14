import { React, toDist } from '../../deps.ts'
import Admin from "../../components/admin/admin.tsx"

function AdminPage() {
  return (
    <>
      <head>
      </head>
      <div className="p-submission-page">
        <Admin />
      </div>
    </>
  );
}

export default toDist(AdminPage, import.meta.url);
