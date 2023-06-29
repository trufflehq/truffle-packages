import { React, UrqlProvider } from "./deps.ts";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP
import Menu from "./components/menu/menu.tsx";
import { truffleApp, user$ } from "./shared/util/truffle/truffle-app.ts";
import { observer } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";

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

const HomePage = observer(() => {
  // HACK: mogul menu doesn't update all queries when the user changes
  // without remounting. not really sure why it doesn't, but remounting (with key) works
  return (
    <UrqlProvider value={truffleApp.gqlClient} key={user$.get()?.id}>
      <Menu iconImageObj={iconImageObj} creatorName={"Ludwig"} />
    </UrqlProvider>
  );
});

const wcObject = toDist(HomePage, import.meta.url);

// add the component to the body
// TODO: we can swap this to a normal react render() method instead of web components
// all we need to do is fix the useStyleSheet to work w/o shadow dom
const wcElement = document.createElement(wcObject.tagName);
document.documentElement.style.height = "100%";
document.body.style.margin = "0";
document.body.style.height = "100%";
document.body.appendChild(wcElement);
