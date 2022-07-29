import FormSetup from "../../../components/form-setup/form-setup.tsx";
import { Link, React, toDist, useStyleSheet } from '../../../deps.ts'
import styleSheet from './page.css.ts';

function FormSetupPage () {
  useStyleSheet(styleSheet);
  return (
    <div className="p-form-setup">
      <div className="nav">
        <Link href="/admin">&lt;Back</Link>
      </div>
      <FormSetup />
    </div>
  )
}

export default toDist(FormSetupPage, import.meta.url);