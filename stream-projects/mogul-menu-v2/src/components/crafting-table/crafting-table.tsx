import React from "https://npm.tfl.dev/react";

import { Component } from "@spore/platform";

export default function CraftingTablePage(props) {
  const { popPage } = props;
  props = {
    ...props,
    onSuccess: popPage,
  };
  return (
    <Component
      slug="browser-extension-menu-page"
      props={{
        title: "Crafting Table",
        content: (
          <Component
            slug="crafting-table"
            props={props}
          />
        ),
        onBack: popPage,
      }}
    />
  );
}
