// import React, { useEffect, useMemo, useRef } from "https://npm.tfl.dev/react";
import { component, useMemo, useState } from 'https://npm.tfl.dev/haunted@5.0.0';
// import PropTypes from "https://npm.tfl.dev/prop-types@15";
import AuthDialog from "https://tfl.dev/@truffle/ui@0.0.2/components/auth-dialog/auth-dialog.entry.js";
// import Input from "https://tfl.dev/@truffle/ui@0.0.2/components/input/input.entry.js";
import Button from "https://tfl.dev/@truffle/ui@0.0.2/components/button/button.entry.js";
// import Dialog from "https://tfl.dev/@truffle/ui@0.0.2/components/dialog/dialog.entry.js";
import { createSubject } from "https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js";
// import ThemeComponent from "https://tfl.dev/@truffle/ui@0.0.2/components/theme/theme-component.js";
// import { gql, useQuery } from "https://tfl.dev/@truffle/api@0.0.1/client.js";
// import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables-haunted.js";
// import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";
import { html, unsafeStatic } from "https://npm.tfl.dev/lit-html@2/static";

// const USER_GET_ME_MUTATION = gql`
//   query { me { id, name } }
// `

function Sandbox() {
  const [hidden, setIsHidden] = useState(true)
  
  const { isOpenSubject } = useMemo(() => {
    return {
      isOpenSubject: createSubject(false),
    };
  }, []);

  const { isOpen } = useObservables(() => ({
    isOpen: isOpenSubject.obs
  }))

  return html`<div>
    <${unsafeStatic(Button)} @click=${() => setIsHidden(false)}>Test3456</${unsafeStatic(Button)}>
    <${unsafeStatic(AuthDialog)} .hidden=${hidden}></${unsafeStatic(AuthDialog)}>
  </div>`
}

// export default toWebComponent(Sandbox)

const elementName = "truffle-sandbox";
customElements.define(elementName, component(Sandbox));
export default elementName

/*

    <button
      onClick={() => {
        isOpenSubject.next(true);
      }}
    >
      test123
    </button>
    <AuthDialog isOpenSubject={isOpenSubject} />
    */