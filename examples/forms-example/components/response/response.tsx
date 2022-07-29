import { React, useStyleSheet } from "../../deps.ts";
import styleSheet from "./response.css.ts";
import { formatDate } from "../../utils/general.ts";
import { FormQuestion, FormResponse } from "../../utils/types.ts";

export default function Response({
  questions,
  response,
}: {
  questions: FormQuestion[];
  response: FormResponse;
}) {
  useStyleSheet(styleSheet);
  const answers = response?.formQuestionAnswerConnection?.nodes;
  const dateStr = response?.time && formatDate(new Date(response.time));

  return (
    <div className="c-response">
      <div className="user-name">{response?.user?.name ?? "No name"}</div>
      <div className="time">{dateStr}</div>
      <div className="question-answer-list">
        {questions.map((question) => {
          const matchingResponse = answers?.find(
            (answer) => answer.formQuestionId === question.id
          );
          return (
            <div className="question-answer">
              <div className="question">{question.question}</div>
              <div className="answer">{matchingResponse?.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
