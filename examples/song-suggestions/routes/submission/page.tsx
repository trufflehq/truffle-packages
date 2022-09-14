import { React, toDist } from '../../deps.ts'
import SubmissionMapping from "../../components/submission-mapping/submission-mapping.tsx"

function SubmissionPage() {
  return (
    <div className="p-submission-page">
      <SubmissionMapping />
    </div>
  );
}

export default toDist(SubmissionPage, import.meta.url);
