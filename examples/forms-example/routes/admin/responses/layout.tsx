import ResponseList from "../../../components/response-list/response-list.tsx";
import Response from '../../../components/response/response.tsx'
import { FORM_SLUG } from "../../../config.ts";
import {
  gql,
  React,
  toDist,
  useParams,
  push,
  useQuery,
  useStyleSheet,
Link,
} from "../../../deps.ts";
import { FormResponse } from "../../../utils/types.ts";
import styleSheet from "./layout.css.ts";

const FORM_QUERY = gql`
  query FormQuery($formSlug: String!) {
    form(input: { slug: $formSlug }) {
      formResponseConnection {
        nodes {
          id
          user {
            id
            name
            avatarImage {
              cdn
              prefix
              ext
              aspectRatio
            }
          }
          time
          formQuestionAnswerConnection {
            nodes {
              id
              formQuestionId
              value
            }
          }
        }
      }

      formQuestionConnection {
        nodes {
          id
          question
        }
      }
    }
  }
`;

function ResponsesPageLayout() {
  const { responseId } = useParams();
  useStyleSheet(styleSheet);

  const [{ data: formData, fetching: isFetching }] = useQuery({
    query: FORM_QUERY,
    variables: { formSlug: FORM_SLUG },
  });
  const responses: FormResponse[] =
    formData?.form?.formResponseConnection?.nodes;
  const selectedResponse = responses?.find((response) => response.id === responseId)
  const questions = formData?.form?.formQuestionConnection?.nodes;

  const responseSelectHandler = (responseId: string) => {
    push(`/admin/responses/${responseId}`)
  };

  if (isFetching) return <>Loading...</>;

  return (
    <div className="l-responses-page">
      <Link href="/admin">&lt;Back</Link>
      <div className="grid">
        <div className="response-list-container">
          <div className="title">Responses</div>
          <div className="list">
            <ResponseList
              responses={responses}
              selectedId={responseId}
              onSelect={responseSelectHandler}
            />
          </div>
        </div>
        <div className="response-container">
          {responseId ? <Response questions={questions} response={selectedResponse} /> : <NoResponseSelected />}
        </div>
      </div>
    </div>
  );
}

function NoResponseSelected() {
  return (
    <div className="no-response-selected">
      <div className="text">Select a response :)</div>
    </div>
  );
}

export default toDist(ResponsesPageLayout, import.meta.url);
