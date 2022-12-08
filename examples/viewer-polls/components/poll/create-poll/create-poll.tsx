import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import TextField from "https://tfl.dev/@truffle/ui@~0.1.0/components/text-field/text-field.tag.ts";
import {
  COLLECTIBLE_BY_SLUG_QUERY,
  OWNED_COLLECTIBLE_REDEEMED_MUTATION,
} from "../gql.ts";
import { CollectibleResponse } from "../types.ts";
import {
  useMutation,
  useQuery,
} from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import UserInfo from "../../user-info/user-info.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import styleSheet from "./create-poll.scss.js";
const MAX_POLL_QUESTIONS = 5;

export default function CreatePoll({ onCancel }) {
  const [activeUser, setActiveUser] = useState();
  const [{ data: collectibleData }] = useQuery({
    query: COLLECTIBLE_BY_SLUG_QUERY,
    variables: {
      input: {
        slug: "viewer-poll",
      },
    },
  });
  useStyleSheet(styleSheet);

  const collectible = (collectibleData as CollectibleResponse)?.collectible;

  const renderCreateManager = () => {
    return activeUser?.name
      ? collectible?.ownedCollectible?.count > 0
        ? <CreatePollManager collectible={collectible} onCancel={onCancel} />
        : (
          <div className="empty">
            You don't own this collectible
          </div>
        )
      : null;
  };

  return (
    <div className="c-create-poll">
      <h2>
        Create a poll
      </h2>
      <div className="auth">
        <UserInfo setActiveUser={setActiveUser} />
      </div>
      {renderCreateManager()}
    </div>
  );
}

function hasOptionInputs(options) {
  return options.reduce((acc, curr) => {
    if (!curr.text) {
      acc = false;
    }

    return acc;
  }, true);
}

function CreatePollManager({ collectible, onCancel }) {
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState([]);
  const [_, executeVoteMutation] = useMutation(
    OWNED_COLLECTIBLE_REDEEMED_MUTATION,
  );

  useEffect(() => {
    const isPollCompleted = options?.length > 0 && question;

    const hasInputs = hasOptionInputs(options);
    setIsSubmitEnabled(isPollCompleted && hasInputs);
  }, [JSON.stringify(options)]);

  const handleAddOption = () => {
    setOptions((oldOptions) => [...oldOptions, {
      text: "Option",
      index: oldOptions?.length,
    }]);
  };

  const handleInput = (e, i) => {
    e.preventDefault();
    const updatedOptions = [...options];
    updatedOptions[i].text = e.target.value || "";
    setOptions(updatedOptions);
  };

  const reset = () => {
    setOptions([]);
    setQuestion([]);
  };

  const handleSubmit = async () => {
    const variables = {
      input: {
        collectibleId: collectible?.id,
        additionalData: {
          question,
          options,
        },
      },
    };

    await executeVoteMutation(variables, {
      additionalTypenames: ["Poll", "PollVote", "PollOption"],
    });
    reset();
    alert("Poll submitted");
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const hasMaxedOptions = options?.length >= MAX_POLL_QUESTIONS;
  return (
    <>
      <div className="body">
        <InputField
          label="Question"
          value={question}
          onInput={(e) => setQuestion(e.target.value)}
        />
        <h3 className="header">
          Possible Outcomes
        </h3>
        <div className="options">
          {options.map((option, i) => (
            <InputField
              value={option.text || ""}
              onInput={(e) => handleInput(e, i)}
            />
          ))}
          {!hasMaxedOptions && (
            <Button
              className="bg-button add"
              onClick={handleAddOption}
            >
              Add Option
            </Button>
          )}
        </div>
      </div>
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
              disabled={!isSubmitEnabled}
            >
              Start Poll
            </Button>
          </div>
        </div>
      </footer>
    </>
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
