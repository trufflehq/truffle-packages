import { FORM_SLUG } from "../../config.ts";
import {
  Button,
  gql,
  React,
  TextField,
  useEffect,
  useMutation,
  useQuery,
  useState,
  useStyleSheet,
} from "../../deps.ts";
import { FormQuestion, Form, FormQuestionAnswer } from "../../utils/types.ts";
import styleSheet from "./form.css.ts";

const FORM_QUERY = gql`
  query FormQuery($formSlug: String!) {
    form(input: { slug: $formSlug }) {
      id
      name
      description
      formQuestionConnection {
        nodes {
          id
          question
        }
      }
    }
  }
`;

const SUBMIT_FORM_MUTATION = gql`
  mutation ($input: FormResponseUpsertInput) {
    formResponseUpsert(input: $input) {
      formResponse {
        id
      }
    }
  }
`;

export default function FormComponent() {
  useStyleSheet(styleSheet);
  const [{ data: formData, fetching: isFetching }] = useQuery({
    query: FORM_QUERY,
    variables: { formSlug: FORM_SLUG },
  });
  const form: Form = formData?.form;
  const questions = form?.formQuestionConnection?.nodes;

  const [questionAnswers, setQuestionAnswers]: [
    FormQuestionAnswer[],
    Function
  ] = useState([]);
  const updateQuestionAnswer = (questionId: string, value: string) => {
    setQuestionAnswers((questionAnswers: FormQuestionAnswer[]) => {
      const newArr = [...questionAnswers];
      const matchingQuestion = newArr.find(
        (questionAnswer) => questionAnswer.formQuestionId === questionId
      );
      if (matchingQuestion) {
        matchingQuestion.value = value;
      }
      return newArr;
    });
  };
  const allQuestionsAnswered = questionAnswers?.every(
    (questionAnswer) => questionAnswer?.value?.length > 0
  );

  // when the questions first load, we want to set up the question answers
  const initQuestionAnswers = () => {
    const initialQuestionAnswers = questions.map((question) => ({
      formQuestionId: question.id,
    }));
    setQuestionAnswers(initialQuestionAnswers);
  };
  useEffect(() => {
    if (questions) {
      initQuestionAnswers();
    }
  }, [questions]);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [_submitResult, executeFormSubmitMutation] =
    useMutation(SUBMIT_FORM_MUTATION);
  const formSubmitHandler = async () => {
    const resp = await executeFormSubmitMutation({
      input: {
        formId: form?.id,
        formQuestionAnswers: questionAnswers,
      },
    });

    const errors = [...(resp?.error?.graphQLErrors ?? [])];

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => `${error?.message}: ${error?.extensions?.info}`)
        .join("; ");
      alert(errorMessages);
      return;
    }

    setHasSubmitted(true);
  };

  if (isFetching) return <>Loading...</>;

  return (
    <div className="c-form">
      {hasSubmitted ? (
        "Thank you for submitting!"
      ) : (
        <>
          <div className="name">{form?.name}</div>
          <p className="description">{form?.description}</p>
          <div className="questions">
            {questions?.map((question) => (
              <FormQuestionEl
                question={question}
                onChange={(val) => updateQuestionAnswer(question.id, val)}
              />
            ))}
          </div>
          <div className="submit">
            <Button
              onClick={formSubmitHandler}
              disabled={!allQuestionsAnswered}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function FormQuestionEl({
  question,
  onChange,
}: {
  question: FormQuestion;
  onChange: (val: string) => void;
}) {
  return (
    <div className="form-question">
      <div className="question-text">{question?.question}</div>
      <TextField onInput={(e: any) => onChange?.(e.target.value)} />
    </div>
  );
}
