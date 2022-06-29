import React, { useMemo, useRef } from "https://npm.tfl.dev/react";

import { createSubject } from "https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";
import { gql, mutation } from "https://tfl.dev/@truffle/api@0.0.1/client.js";

import Button from "../button/button.jsx";
import Dialog, { Dialog$ } from "../dialog/dialog.jsx";
import { Input$ } from "../input/input.jsx";
import FormControl from "../form-control/form-control.tsx";
import { useThemeContext } from "../theme/theme-context.js";
import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.jsx";

const JOIN_MUTATION = gql`mutation UserJoin($input: UserJoinInput!) {
  userJoin(input: $input) { accessToken }
}`;
const RESET_PASSWORD_MUTATION = gql
  `mutation UserResetPassword($input: UserResetPasswordInput!) {
  userResetPassword(input: $input) { hasSentResetEmail }
}`;
const LOGIN_MUTATION = gql
  `mutation UserLoginEmailPhone($input: UserLoginEmailPhoneInput!) {
  userLoginEmailPhone(input: $input) { accessToken }
}`;

export default function AuthDialog(props) {
  const { modeSubject } = useMemo(() => {
    return {
      modeSubject: createSubject("join"),
    };
  }, []);

  const { mode } = useObservables(() => ({
    mode: modeSubject.obs,
  }));

  const title = mode === "login"
    ? "Login"
    : mode === "reset"
    ? "Reset"
    : "Join";

  const DialogElement = props.Dialog || Dialog;
  return (
    <DialogElement
      {...props}
      title={title}
      description={<Description modeSubject={modeSubject} />}
      content={<Content modeSubject={modeSubject} />}
    />
  );
}

function Description({ modeSubject }) {
  const themeContext = useThemeContext();

  const { mode } = useObservables(() => ({
    mode: modeSubject.obs,
  }));

  // TODO: helper fn
  const cssUrl = themeContext.components?.dialog.cssUrl ||
    new URL("./auth-dialog.css", import.meta.url);

  const toggleMode = () => {
    modeSubject.next(mode === "login" ? "join" : "login");
  };

  return (
    <ScopedStylesheet url={cssUrl}>
      <div className="c-description">
        Already have an account?
        <span className="login-toggle" onClick={toggleMode}>
          {mode === "login" ? "Join" : "Login"}
        </span>
      </div>
    </ScopedStylesheet>
  );
}

function Content({ modeSubject }) {
  const {
    isLoadingSubject,
    hasErrorSubject,
    fields,
  } = useMemo(() => {
    return {
      isLoadingSubject: createSubject(false),
      hasErrorSubject: createSubject(false),
      fields: {
        name: {
          valueSubject: createSubject(""),
          errorSubject: createSubject(),
        },
        emailPhone: {
          valueSubject: createSubject(""),
          errorSubject: createSubject(),
        },
        password: {
          valueSubject: createSubject(""),
          errorSubject: createSubject(),
        },
      },
    };
  }, []);

  const { isLoading, mode } = useObservables(() => ({
    isLoading: isLoadingSubject.obs,
    mode: modeSubject.obs,
  }));

  const displayNameRef = useRef();

  const onSubmit = async () => {
    console.log("submit", isLoading);

    if (isLoading) {
      return;
    }
    let mutationRes;
    if (mode === "login") {
      await mutation(LOGIN_MUTATION, {
        input: {
          ...parseEmailPhone(fields.emailPhone.valueSubject.getValue()),
          password: fields.password.valueSubject.getValue(),
        },
      });
    } else if (mode === "reset") {
      await mutation(RESET_PASSWORD_MUTATION, {
        input: {
          ...parseEmailPhone(fields.emailPhone.valueSubject.getValue()),
        },
      });
    } else {
      mutationRes = await mutation(JOIN_MUTATION, {
        input: {
          ...parseEmailPhone(fields.emailPhone.valueSubject.getValue()),
          password: fields.password.valueSubject.getValue(),
        },
      });
    }
    if (mutationRes?.error) {
      // TODO: surely a cleaner way to do this
      const errorInfo = mutationRes?.error?.graphQLErrors?.[0]?.extensions
        ?.info;

      hasErrorSubject.next(true);
      const errorSubject = fields[errorInfo?.field]?.errorSubject ||
        fields.emailPhone.errorSubject;
      // TODO: better error messages
      errorSubject.next(errorInfo?.langKey || "Error");
    }
  };

  console.log("ref111", displayNameRef);

  return (
    <>
      <FormControl isInvalid={true}>
        <Input$
          ref={displayNameRef}
          label="Display name"
          valueSubject={fields.name.valueSubject}
        />
      </FormControl>
      {
        /* <Input$
        label="Email or phone #"
        valueSubject={fields.emailPhone.valueSubject}
      />
      <Input$
        label="Password"
        type="password"
        valueSubject={fields.password.valueSubject}
      /> */
      }
      <Button text="go" onClick={onSubmit} />
    </>
  );
}

export function AuthDialog$(props) {
  const newProps = {
    Dialog: Dialog$,
  };

  return <AuthDialog {...props} {...newProps} />;
}

function parseEmailPhone(emailPhone) {
  const isPhone = emailPhone?.match(
    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
  );
  if (isPhone) {
    return { phone: emailPhone };
  } else {
    return { email: emailPhone };
  }
}
