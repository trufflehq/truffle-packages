import { DEFAULT_FORM_NAME, FORM_SLUG } from "../../config.ts";
import {
  TextField,
  React,
  useStyleSheet,
  TextArea,
  gql,
  Button,
  useState,
  useQuery,
  useMutation,
  useEffect,
} from "../../deps.ts";
import { Form, FormQuestion } from "../../utils/types.ts";
import EditFormQuestions from "../edit-form-questions/edit-form-questions.tsx";
import styleSheet from "./form-setup.scss.js";

const FORM_QUERY = gql`
  query GetForm($slug: String) {
    form(input: { slug: $slug }) {
      id
      name
      data
      description
      maxResponsesPerUser
      formQuestionConnection {
        nodes {
          id
          question
        }
      }
    }
  }
`;

const SAVE_FORM_MUTATION = gql`
  mutation FormUpsert($input: FormUpsertInput!) {
    formUpsert(input: $input) {
      form {
        id
        name
        slug
      }
    }
  }
`;

const SAVE_FORM_QUESTIONS_MUTATION = gql`
  mutation BatchUpsertFormQuestions($input: FormQuestionBatchUpsertInput!) {
    formQuestionBatchUpsert(input: $input) {
      formQuestions {
        id
        question
        type
      }
    }
  }
`;

const DELETE_FORM_QUESTION_MUTATION = gql`
  mutation DeleteFormQuestion($id: ID!) {
    formQuestionDeleteById(input: { id: $id }) {
      formQuestion {
        id
      }
    }
  }
`;

export default function FormSetup() {
  useStyleSheet(styleSheet);

  // form data fetch
  const [{ data: formData, fetching: isFetchingForm }, refetchForm] = useQuery({
    query: FORM_QUERY,
    variables: { slug: FORM_SLUG },
  });
  const form: Form = formData?.form;

  // form upsert mutation
  const [_formSaveResult, executeSaveFormMutation] =
    useMutation(SAVE_FORM_MUTATION);

  // questions save mutation
  const [_questionsSaveResult, executeQuestionSaveMutation] = useMutation(
    SAVE_FORM_QUESTIONS_MUTATION
  );

  // form state
  const [formState, setFormState] = useState(null);
  const setFormProp = (prop: string, value: any) =>
    setFormState((prev: Form) => ({ ...prev, [prop]: value }));
  const changeHandler = (setFn: Function) => (e: any) => setFn(e.target?.value);
  const propChange = (prop: string) =>
    changeHandler((value: any) => setFormProp(prop, value));

  useEffect(() => {
    if (form) {
      setFormState({
        id: form.id,
        name: form.name,
        description: form.description,
        questions: form.formQuestionConnection.nodes ?? [],
      });
    }
  }, [form]);

  // question deletion
  const [questionIdsToDelete, setQuestionIdsToDelete] = useState([]);
  const queueQuestionDelete = (question: FormQuestion) => {
    if (question?.id) {
      setQuestionIdsToDelete((prev: string[]) => prev.concat(question.id));
    }
  };
  const [_deleteQuestionResult, executeDeleteQuestionMutation] = useMutation(
    DELETE_FORM_QUESTION_MUTATION
  );

  const saveFormHandler = async () => {
    const hasQuestionsToDelete = questionIdsToDelete?.length > 0;

    // update the form, questions, and delete questions
    const [formSaveResp, questionsSaveResp, questionDeleteResp] =
      await Promise.all([
        // save the form
        executeSaveFormMutation({
          input: {
            id: form?.id,
            name: formState?.name,
            description: formState?.description,
          },
        }),

        // save the questions
        executeQuestionSaveMutation({
          input: {
            formId: form?.id,
            formQuestions: formState?.questions?.map(questionInputFilter),
          },
        }),

        // delete any questions that need to be deleted
        hasQuestionsToDelete &&
          questionIdsToDelete.map((questionId: string) =>
            executeDeleteQuestionMutation({ id: questionId })
          ),
      ]);

    // we need to make sure we get the ids of the newly created questions
    const savedQuestions =
      questionsSaveResp?.data?.formQuestionBatchUpsert?.formQuestions;
    setFormProp("questions", savedQuestions);

    alert("Form saved!");
  };

  if (!formState) return <>Loading...</>;

  return (
    <div className="c-form-setup">
      <h2>Form Setup</h2>
      <div className="form">
        <TextField onChange={propChange("name")} value={formState?.name}>
          Name
        </TextField>
        <TextArea
          onChange={propChange("description")}
          value={formState?.description}
        >
          Description
        </TextArea>
        <EditFormQuestions
          questions={formState?.questions ?? []}
          onChange={(newQuestions) => setFormProp("questions", newQuestions)}
          onDelete={(toDelete) => queueQuestionDelete(toDelete)}
        />
        <Button onClick={saveFormHandler}>Save</Button>
      </div>
    </div>
  );
}

const questionInputFilter = (question: any) => ({
  id: question?.id,
  question: question?.question,
  rank: question?.rank,
});
