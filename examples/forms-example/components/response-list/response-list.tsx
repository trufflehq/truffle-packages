import { React, useStyleSheet } from "../../deps.ts";
import { formatDate } from "../../utils/general.ts";
import { FormResponse } from "../../utils/types.ts";
import styleSheet from "./response-list.css.ts";

export default function ResponseList({
  responses,
  onSelect,
  selectedId,
}: {
  responses: FormResponse[];
  onSelect: (responseId: string) => void;
  selectedId: string;
}) {
  useStyleSheet(styleSheet);
  return (
    <div className="c-response-list">
      {responses?.map((response) => (
        <>
          <ResponseListItem
            response={response}
            isSelected={response.id === selectedId}
            onClick={() => onSelect(response.id)}
          />
        </>
      ))}
    </div>
  );
}

function ResponseListItem({
  response,
  onClick,
  isSelected,
}: {
  response: FormResponse;
  onClick: () => void;
  isSelected: boolean;
}) {
  const dateStr = response?.time && formatDate(new Date(response.time));

  return (
    <div
      onClick={onClick}
      className={`response-list-item ${isSelected && "is-selected"}`}
    >
      <div className="user-name">{response?.user?.name ?? "No name"}</div>
      <div className="date">{dateStr}</div>
    </div>
  );
}
