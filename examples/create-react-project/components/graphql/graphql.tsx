import React, { useState } from "https://npm.tfl.dev/react";
import { useParams } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import {
  useMutation,
  useQuery,
} from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import Highlight, {
  defaultProps,
} from "https://npm.tfl.dev/prism-react-renderer@1.3.5";

import examples from "./examples.ts";
import styleSheet from "./graphql.scss.js";

export default function Graphql() {
  const { exampleSlug } = useParams();

  useStyleSheet(styleSheet);

  const example = examples[exampleSlug];

  return (
    <div className="c-graphql">
      <h2>{exampleSlug}: {example.title}</h2>
      <a href={example.docsUrl} target="_blank">Docs</a>
      <Example example={example} />
    </div>
  );
}

function Example({ example }) {
  const [queryResult, reexecuteQuery] = useQuery({
    query: example.resolver.query,
    variables: example.resolver.variables,
  });

  const [mutationResult, mutationExecute] = useMutation(example.mutation.query);
  const [mutationVariablesStr, setMutationVariablesStr] = useState(
    JSON.stringify(example.mutation.variables, null, 2),
  );

  return (
    <div className="c-graphql_example">
      <h2>Resolver</h2>
      <div className="subtitle">Query</div>
      <div className="query">
        <CodeHighlight
          language="graphql"
          code={getGqlString(example.resolver.query)}
        />
      </div>
      <div className="subtitle">Variables</div>
      <div className="variables">
        <CodeHighlight
          language="json"
          code={JSON.stringify(example.resolver.variables)}
        />
      </div>
      <div className="subtitle">Result</div>
      {queryResult.error && `Error: ${queryResult.error}`}
      <div className="result">
        {queryResult.fetching && "Loading..."}
        {!queryResult.fetching && (
          <CodeHighlight
            language="json"
            code={JSON.stringify(queryResult.data, null, 2)}
          />
        )}
      </div>

      <h2>Mutation</h2>
      <div className="subtitle">Query</div>
      <div className="query">
        <CodeHighlight
          language="graphql"
          code={getGqlString(example.mutation.query)}
        />
      </div>
      <div className="subtitle">Variables</div>
      <div className="variables">
        <textarea onInput={(e) => setMutationVariablesStr(e.target.value)}>
          {mutationVariablesStr}
        </textarea>
      </div>
      {mutationResult.error && `Error: ${mutationResult.error}`}
      <div className="result">
        {mutationResult.fetching && "Loading..."}
        {mutationResult.data && !mutationResult.fetching && (
          <CodeHighlight
            language="json"
            code={JSON.stringify(mutationResult.data, null, 2)}
          />
        )}
      </div>
      <Button onClick={() => mutationExecute(JSON.parse(mutationVariablesStr))}>
        Execute
      </Button>
    </div>
  );
}

function getGqlString(doc) {
  return (doc.loc && doc.loc.source.body) || "";
}

function CodeHighlight({ code, language }) {
  return (
    <Highlight
      {...defaultProps}
      language={language}
      code={code || ""}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
