import React from "https://npm.tfl.dev/react";
import { useParams } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import ActivePoll from "../../../components/poll/active-poll/active-poll.tsx";
function PollIdPage() {
  const params = useParams();
  const { id } = params || {};

  const handleDelete = () => {
    console.log("handle delete");
  };
  const handleEnd = () => {
    console.log("handle end");
  };

  return (
    <div className="p-poll-id-page">
      <ActivePoll pollId={id} />
      <footer>
        <div className="inner">
          <div className="button">
            <Button
              className="secondary-button"
              onClick={handleDelete}
            >
              Cancel
            </Button>
          </div>
          <div className="button">
            <Button
              className="primary-button"
              onClick={handleEnd}
            >
              Start Poll
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default toDist(PollIdPage, import.meta.url);
