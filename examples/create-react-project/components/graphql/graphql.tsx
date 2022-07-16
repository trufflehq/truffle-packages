import React, { useState } from "https://npm.tfl.dev/react";
import { useParams } from "https://tfl.dev/@truffle/router@^1.0.0/index.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import {
  useMutation,
  useQuery,
} from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";

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
      <div className="query">{getGqlString(example.resolver.query)}</div>
      <div className="subtitle">Variables</div>
      <div className="variables">
        {JSON.stringify(example.resolver.variables)}
      </div>
      <div className="subtitle">Result</div>
      {queryResult.error && `Error: ${queryResult.error}`}
      <div className="result">
        {queryResult.fetching && "Loading..."}
        {!queryResult.fetching && JSON.stringify(queryResult.data)}
      </div>

      <h2>Mutation</h2>
      <div className="subtitle">Query</div>
      <div className="query">{getGqlString(example.mutation.query)}</div>
      <div className="subtitle">Variables</div>
      <div className="variables">
        <textarea onInput={(e) => setMutationVariablesStr(e.target.value)}>
          {mutationVariablesStr}
        </textarea>
      </div>
      {mutationResult.error && `Error: ${mutationResult.error}`}
      <div className="result">
        {mutationResult.fetching && "Loading..."}
        {!mutationResult.fetching && JSON.stringify(mutationResult.data)}
      </div>
      <Button onClick={() => mutationExecute(JSON.parse(mutationVariablesStr))}>
        Execute
      </Button>
    </div>
  );
}

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}
