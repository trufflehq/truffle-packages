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

import Button from "../button/button.jsx";
import Dialog from "../dialog/dialog.entry.tsx";
import InputObs from "../input/input-obs.entry.tsx";
import FormControl from "../form-control/form-control.tsx";
import FormLabel from "../form-label/form-label.tsx";
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

function AuthDialog(props) {
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
    <DialogElement {...props}>
      <DialogTitle></DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions></DialogActions>
    </DialogElement>
  );
}

AuthDialog.propTypes = {
  isOpenSubject: PropTypes.object,
  Dialog: PropTypes.object,
};

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
    <>
      <Stylesheet url={cssUrl} />
      <div className="c-description">
        Already have an account?
        <span className="login-toggle" onClick={toggleMode}>
          {mode === "login" ? "Join" : "Login"}
        </span>
      </div>
    </>
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

  const onSubmit = async () => {
    console.log("submit");

    if (isLoading) {
      return;
    }
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

  // FIXME: get id, value to pass through to react component
  return (
    <>
      <FormControl isInvalid={true}>
        <FormLabel htmlFor="display-name">Display Name</FormLabel>
        <InputObs
          id="name"
          id2="name2"
          valueSubject={fields.name.valueSubject}
        />
      </FormControl>
      <FormControl isInvalid={true}>
        <FormLabel>Email or phone #</FormLabel>
        <InputObs
          id="email-phone"
          valueSubject={fields.emailPhone.valueSubject}
        />
      </FormControl>
      <FormControl isInvalid={true}>
        <FormLabel>Password</FormLabel>
        <InputObs
          id="password"
          type="password"
          valueSubject={fields.password.valueSubject}
        />
      </FormControl>
      <Button text="go" onClick={onSubmit} />
    </>
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
