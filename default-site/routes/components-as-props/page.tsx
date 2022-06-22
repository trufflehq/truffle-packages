import React, { lazy, Suspense, useMemo } from "react";

import ComponentWithProps from "../../components/component-with-props/component-with-props.tsx";

const componentInstances = [
  {
    id: "fixme",
    props: { text: "hi" },
    component: {
      module: {
        url: "https://tfl.dev/@truffle/ui@0.0.1/components/button/button.jsx",
      },
    },
  },
];

export default function ComponentWithPropsPage({ children }) {
  const fromDb = {
    title: "Some title",
    component: {
      __typename: "ComponentInstance",
      id: "fixme",
    },
  };
  const components = [
    {
      ...fromDb,
      component: (
        <ComponentInstanceRelToComponent
          componentInstanceRel={fromDb.component}
        />
      ),
    },
  ];
  return (
    <>
      <ComponentWithProps components={components} />
    </>
  );
}

function ComponentInstanceRelToComponent({ componentInstanceRel }) {
  const componentInstance = componentInstances.find(({ id }) =>
    id === componentInstanceRel.id
  );

  const Component = useMemo(() => {
    return lazy(() => import(componentInstance.component.module.url));
  }, []);

  return (
    <Suspense>
      {/* React.createElement so we use our prop injected version */}
      {React.createElement(Component, componentInstance.props)}
    </Suspense>
  );
}
