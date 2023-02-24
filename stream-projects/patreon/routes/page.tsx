import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import PremiumContentEmbed from "../components/premium-content-embed/premium-content-embed.tsx";

function EmbedPage() {
  return (
    <PremiumContentEmbed
      patreonUsername="theyard"
      url="https://www.patreon.com/posts/ep-83-premium-78759612?embed"
      title="Ep. 83 Premium - aidens new cut"
      previewImageSrc="https://image.mux.com/02QeSZsrnC00KgaocgyacCygdGIxf8KU5CM6VqnxHCdVg/thumbnail.jpg?token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5CY3o3Sk5RcUNmdDdWcmo5MWhra2lEY3Vyc2xtRGNmSU1oSFUzallZMDI0IiwidHlwIjoiSldUIn0.eyJzdWIiOiIwMlFlU1pzcm5DMDBLZ2FvY2d5YWNDeWdkR0l4ZjhLVTVDTTZWcW54SENkVmciLCJleHAiOjE2Nzk0NTYzNzksImF1ZCI6InQiLCJ0aW1lIjoyLjB9.OeS9Q0XRwZsVhiQNnHJYo9TFSxRkSMNf_8G_LlGNJhgYeEFnQ5C8Ftd9XQMCy_WnH9mFES7qbXzQ9-YIjkIReImwQDgvWTb8f6qctmj3PE8pCAfLOY_8BA-n6fpOEnyd4dtE4p5xepT1-TfnPvwsJzOsW5jdfm1WrnEfTjRQlvV7-s5PNeHJPFbD1T3vEjiwMd-G46CI9VhRXnC5x7c51cQxnqKMlCo5tNitaSfC5lNKpYCiyWlX9qm8QJeJQG9fCKMeINRbeeNrQKzEL29ESZH88Fy-7tT_tikT0AjMf4sJluS1iLXNeS8kBoI6cKSKtO2-aZGt7KVu-U3NxP6ThA"
    />
  );
}

export default toDist(EmbedPage, import.meta.url);
