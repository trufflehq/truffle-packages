import { Button, React, TextField, useMutation, useQuery, useState, useStyleSheet } from "../../deps.ts";
import { COLLECTIBLE_BY_SLUG_QUERY, OWNED_COLLECTIBLE_REDEEMED_MUTATION } from "../../gql/mod.ts";
import { CollectibleResponse } from "../../types/mod.ts";
import { getYTVidId } from "../../utils/mod.ts";

import UserInfo from "../user-info/user-info.tsx";
import YouTubeEmbed from "../youtube-embed/youtube-embed.tsx";
import styleSheet from "./submission.scss.js";

export default function Submission({ onCancel }: { onCancel: () => void }) {
  const [activeUser, setActiveUser] = useState();
  const [link, setLink] = useState();
  const [{ data: collectibleData }] = useQuery({
    query: COLLECTIBLE_BY_SLUG_QUERY,
    variables: {
      input: {
        slug: "song-submission",
      },
    },
  });
  const [_, executeVoteMutation] = useMutation(
    OWNED_COLLECTIBLE_REDEEMED_MUTATION,
  );

  const collectible = (collectibleData as CollectibleResponse)?.collectible;

  
  console.log('collectible', collectible)
  useStyleSheet(styleSheet);

  console.log("activeUser", activeUser);

  const handleCancel = () => {
    console.log("cance;l");
    onCancel?.();
    setLink("");
  };

  const handleSubmit = async () => {
    console.log("submit link");
    const variables = {
      input: {
        collectibleId: collectible?.id,
        additionalData: {
          link
        },
      },
    };

    await executeVoteMutation(variables, {
      additionalTypenames: ["Poll", "PollVote", "PollOption"],
    });
  };

  const ytVideoId = getYTVidId(link);

  const renderSubmissionForm = () => {
    return (
      <div className="body">
        {ytVideoId && (
          <div className="embed">
            <YouTubeEmbed link={link} />
          </div>
        )}
        <InputField
          label="YouTube Link"
          value={link}
          onInput={(e) => setLink(e.target.value)}
        />
        <footer>
          <div className="inner">
            <div className="button">
              <Button
                className="secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
            <div className="button">
              <Button
                className="primary-button"
                onClick={handleSubmit}
                disabled={!ytVideoId}
              >
                Submit
              </Button>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  console.log("ytVideoId", ytVideoId);

  return (
    <div className="c-submission">
      <h2>
        Submit a Song
      </h2>
      <div className="auth">
        <UserInfo setActiveUser={setActiveUser} />
      </div>
      {renderSubmissionForm()}
    </div>
  );
}

type InputFieldProps = {
  onInput: (e) => void;
  value: string;
  label?: string;
};

function InputField({ onInput, value, label }: InputFieldProps) {
  return (
    <div className="c-input-field">
      {label && (
        <label>
          {label}
        </label>
      )}
      <TextField
        className="input"
        type="text"
        value={value}
        label="Question"
        oninput={onInput}
      />
    </div>
  );
}
