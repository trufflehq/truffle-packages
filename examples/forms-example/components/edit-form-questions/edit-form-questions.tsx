import { React, Button, TextField, useEffect, useState } from "../../deps.ts";
import { FormQuestion } from '../../utils/types.ts'

export default function EditFormQuestions({
  questions,
  onChange,
  onDelete
}: {
  questions: FormQuestion[];
  onChange: (questions: FormQuestion[]) => void;
  onDelete: (toDelete: FormQuestion) => void;
}) {
  const [questionsState, setQuestions]: [FormQuestion[], Function] = useState(
    questions ?? []
  );

  const getQuestionTextChangeHandler = (questionIdx: number) => {

    return (questionText: string) => {
      setQuestions((prev: FormQuestion[]) => {
        const newArr = [...prev]
        newArr[questionIdx].question = questionText
        return newArr;
      });
    };
  };

  const getQuestionDeleteHandler = (questionIdx: number) => {
    return () => {
      onDelete(questionsState[questionIdx]);
      setQuestions((prev: FormQuestion[]) => {
        const newArr = [...prev]
        newArr.splice(questionIdx, 1)
        return newArr
      });
    };
  };

  const addQuestion = () =>
    setQuestions((prev: Partial<FormQuestion>[]) =>
      prev.concat({ question: "" })
    );

  
  useEffect(() => {
    // make sure the questions get ordered with the 'rank' property before they're upserted into the db
    const orderedQuestions = questionsState.map((question, idx) => ({ ...question, rank: idx }))
    onChange(orderedQuestions)
  }, [questionsState])

  return (
    <div className="questions-list">
      <h3>Questions</h3>
      <div className="list">
        {questionsState?.map((question, idx) => (
          <QuestionEl
            key={idx}
            question={question}
            onChange={getQuestionTextChangeHandler(idx)}
            onDelete={getQuestionDeleteHandler(idx)}
          />
        ))}
      </div>
      <Button onClick={addQuestion}>Add</Button>
    </div>
  );
}

function QuestionEl({
  question,
  onChange,
  onDelete,
}: {
  question: FormQuestion;
  onChange: (questionText: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="question">
      <TextField
        value={question.question}
        onChange={(e: any) => onChange?.(e.target?.value)}
      />
      <Button onClick={onDelete ?? (() => null)}>Delete</Button>
    </div>
  );
}