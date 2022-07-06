import React, { useEffect, useMemo, useRef } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import AuthDialog from "https://tfl.dev/@truffle/ui@0.0.2/components/auth-dialog/auth-dialog.entry.js";
import Input from "https://tfl.dev/@truffle/ui@0.0.2/components/input/input.entry.js";
import Button from "https://tfl.dev/@truffle/ui@0.0.2/components/button/button.entry.js";
// import Dialog from "https://tfl.dev/@truffle/ui@0.0.2/components/dialog/dialog.entry.js";
import { createSubject } from "https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js";
import ThemeComponent from "https://tfl.dev/@truffle/ui@0.0.2/components/theme/theme-component.js";
import { gql, useQuery } from "https://tfl.dev/@truffle/api@0.0.1/client.js";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

const USER_GET_ME_MUTATION = gql`
  query { me { id, name } }
`

function Sandbox() {
  const [res, ex] = useQuery({ query: USER_GET_ME_MUTATION })
  console.log('resssss', res.data?.me);
  
  const { isOpenSubject } = useMemo(() => {
    return {
      isOpenSubject: createSubject(false),
    };
  }, []);

  const { isOpen } = useObservables(() => ({
    isOpen: isOpenSubject.obs
  }))

  const ref = useRef()

  useEffect(() => {
    // setTimeout(() => {
    //   console.log('ref', ref);
    //   ref.current.style.background = 'red'
    // }, 1000)
  }, [])

  return (
    <div>
      <style>{`input { background: blue; }`}</style>
      <ThemeComponent />
      <Button onClick={() => isOpenSubject.next(true)}>Test</Button>
      {/* <Dialog hidden={!isOpen} modal={true} oncancel={() => { isOpenSubject.next(false); }}>
        <div className="abc">abc</div>
        <Button onClick={() => isOpenSubject.next(false)}>Test</Button>
      </Dialog> */}
      <Input reactRef={ref} handleChange={(e) => console.log(e)} value="abc" />
      <button
        onClick={() => {
          isOpenSubject.next(true);
        }}
      >
        test123
      </button>
      <AuthDialog isOpenSubject={isOpenSubject} />
    </div>
  );
}

export default toWebComponent(Sandbox)