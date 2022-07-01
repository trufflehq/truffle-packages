import React, { useMemo, useRef } from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import { createSubject } from "https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";
import {
  _clearCache,
  gql,
  mutation,
} from "https://tfl.dev/@truffle/api@0.0.1/client.js";
import { setCookie } from "https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js";

import Button from "../button/button.entry.ts";
import Dialog from "../dialog/dialog.entry.ts";
import Input from "../input/input.entry.ts";
import { useThemeContext } from "../theme/theme-context.js";
import Stylesheet from "../stylesheet/stylesheet.jsx";

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

function AuthDialog({ isOpenSubject }) {
  const { modeSubject, isLoadingSubject, hasErrorSubject, fields } = useMemo(
    () => {
      return {
        modeSubject: createSubject("join"),
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
    },
    [],
  );

  const { mode, isOpen, isLoading } = useObservables(() => ({
    mode: modeSubject.obs,
    isOpen: isOpenSubject.obs,
    isLoading: isLoadingSubject.obs,
  }));

  const onSubmit = async () => {
    if (isLoading) {
      return;
    }
    isLoadingSubject.next(true);
    let mutationRes;
    if (mode === "login") {
      mutationRes = await mutation(LOGIN_MUTATION, {
        input: {
          ...parseEmailPhone(fields.emailPhone.valueSubject.getValue()),
          password: fields.password.valueSubject.getValue(),
        },
      });
    } else if (mode === "reset") {
      mutationRes = await mutation(RESET_PASSWORD_MUTATION, {
        input: {
          ...parseEmailPhone(fields.emailPhone.valueSubject.getValue()),
        },
      });
    } else {
      mutationRes = await mutation(JOIN_MUTATION, {
        input: {
          name: fields.name.valueSubject.getValue(),
          ...parseEmailPhone(fields.emailPhone.valueSubject.getValue()),
          password: fields.password.valueSubject.getValue(),
        },
      });
      const accessToken = mutationRes?.data?.userJoin?.accessToken;
      if (accessToken) {
        setCookie("accessToken", accessToken);
        _clearCache();
      }
      isLoadingSubject.next(false);
    }

    if (mutationRes?.error) {
      // TODO: surely a cleaner way to do this
      const errorInfo = mutationRes?.error?.graphQLErrors?.[0]?.extensions
        ?.info;

      console.log("error", errorInfo);

      hasErrorSubject.next(true);
      const errorSubject = fields[errorInfo?.field]?.errorSubject ||
        fields.emailPhone.errorSubject;
      // TODO: better error messages
      errorSubject.next(errorInfo?.langKey || "Error");
    }
  };

  const actionText = mode === "login"
    ? "Login"
    : mode === "reset"
    ? "Reset"
    : "Join";

  return (
    <Dialog
      open={isOpen}
      onsl-hide={() => {
        isOpenSubject.next(false);
      }}
    >
      <Stylesheet url={new URL("./auth-dialog.css", import.meta.url)} />
      <Header slot="label" actionText={actionText} modeSubject={modeSubject} />
      <Content mode={mode} fields={fields} />
      <Footer
        slot="footer"
        actionText={actionText}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Dialog>
  );
}

AuthDialog.propTypes = {
  isOpenSubject: PropTypes.object,
  Dialog: PropTypes.object,
};

function Content({ mode, fields }) {
  return (
    <>
      {mode === "join" && (
        <InputWrapper label="Display name" field={fields.name} />
      )}
      <InputWrapper label="Email or phone #" field={fields.emailPhone} />
      <InputWrapper
        type="password"
        label="Password"
        field={fields.password}
      />
    </>
  );
}

function InputWrapper({ type = "text", label, field }) {
  const { value, error } = useObservables(() => ({
    value: field.valueSubject.obs,
    error: field.errorSubject.obs,
  }));

  console.log(value, error);

  return (
    <div className={`input-wrapper ${error ? "has-error" : ""}`}>
      <Input
        label={label}
        type={type}
        // invalid={Boolean(error)}
        helpText={error}
        value={value}
        onInput={(e) => field.valueSubject.next(e.target.value)}
      />
    </div>
  );
}

function Header({ slot, modeSubject, actionText }) {
  const { mode } = useObservables(() => ({
    mode: modeSubject.obs,
  }));

  const toggleMode = () => {
    modeSubject.next(mode === "login" ? "join" : "login");
  };

  return (
    <div className="header" slot={slot}>
      <div className="title">{actionText}</div>
      <div className="description">
        Already have an account?
        <span className="login-toggle" onClick={toggleMode}>
          {mode === "login" ? "Join" : "Login"}
        </span>
      </div>
    </div>
  );
}

function Footer({ slot, onSubmit, actionText, isLoading }) {
  return (
    <Button slot={slot} onClick={onSubmit} loading={isLoading}>
      {actionText}
    </Button>
  );
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

export default toWebComponent(AuthDialog);
