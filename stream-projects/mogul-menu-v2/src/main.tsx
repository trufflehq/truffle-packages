import { React, UrqlProvider } from "./deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP
import Menu from "./components/menu/menu.tsx";
import { truffleApp$ } from "./shared/util/truffle/truffle-app.ts";
import {
  Memo,
  observer,
  useObserve,
} from "https://npm.tfl.dev/@legendapp/state@1.2.8/react";

const iconImageObj = {
  id: "f38e1f40-fe27-11ec-8613-c8d0b98b6415",
  cdn: "cdn.bio",
  data: {
    name: "extension_icon.png",
    aspectRatio: 1,
    width: 756,
    height: 756,
    length: 759469,
  },
  prefix:
    "file/094ee050-61d3-11eb-ae77-b305acd7f0af/f38e1f40-fe27-11ec-8613-c8d0b98b6415",
  ext: "png",
  contentType: "image/png",
  type: "image",
  variations: [
    { postfix: ".tiny", width: 144, height: 144 },
    {
      postfix: ".small",
      width: 256,
      height: 256,
    },
    { postfix: ".large", width: 1024, height: 1024 },
  ],
};

function HomePage() {
  useObserve(() => {
    console.log("new client", truffleApp$.get().gqlClient);
  });
  return (
    <UrqlProvider value={truffleApp$.get().gqlClient}>
      <Memo>
        <Menu iconImageObj={iconImageObj} creatorName={"Ludwig"} />
      </Memo>
    </UrqlProvider>
  );
}

const wcObject = toDist(observer(HomePage), import.meta.url);

// add the component to the body
const wcElement = document.createElement(wcObject.tagName);
document.body.appendChild(wcElement);
