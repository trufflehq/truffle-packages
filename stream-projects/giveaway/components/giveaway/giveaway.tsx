import React, { useEffect } from "https://npm.tfl.dev/react";
import {
  gql,
  mutation,
  useQuery,
} from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import {
  signal,
  useSignal,
} from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";
import { observer } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";

import styleSheet from "./giveaway.scss.js";

// NOTE: this file is bad code, don't use as example

const BASE_STYLE = {
  width: "100%",
  display: "block", // need to replace hidden style
  "margin-bottom": "12px",
  background: "transparent",
};

const FORM_STYLE = {
  ...BASE_STYLE,
  height: "318px",
};

const THANKS_STYLE = {
  ...BASE_STYLE,
  height: "172px",
};

const HIDDEN_STYLE = {
  display: "none",
};

type GiveawayProps = {};

const FORM_RESPONSE_CONNECTION_QUERY = gql`
  query FormResponseConnection($input: FormResponseConnectionInput!) {
    formResponseConnection(input: $input) {
      nodes {
        id
      }
    }
  }
`;

const FORM_RESPONSE_UPSERT_MUTATION = gql`
  mutation FormResponseUpsert($input: FormResponseUpsertInput!) {
    formResponseUpsert(input: $input) {
      formResponse { id }
    }
  }
`;

const FORM_ID = "c10bbce0-1964-11ee-bf4c-a5444e22d20b";
const ORG_ID = "3fced6c0-ef0f-11eb-87f7-ab208466080e"; // the-stanz-show

const isSubscribed$ = signal(false);
jumper.call("layout.listenForElements", {
  listenElementLayoutConfigSteps: [
    {
      action: "querySelector",
      value: "body",
    },
  ],
  observerConfig: {
    attributes: true,
    childList: true,
    subtree: true,
  },
  targetQuerySelector: "ytd-subscribe-button-renderer",
}, (matches) => {
  isSubscribed$.set(!!matches?.find((match) => match.data.subscribed));
});

const Giveaway = observer(
  ({}: GiveawayProps) => {
    useStyleSheet(styleSheet);
    useGoogleFontLoader(() => ["Roboto"]);

    const email$ = useSignal("");
    const hasEntered$ = useSignal(false);
    // const isTosVisible$ = useSignal(false);

    const [{ data, fetching }] = useQuery(
      {
        query: FORM_RESPONSE_CONNECTION_QUERY,
        variables: { input: { formId: FORM_ID, orgId: ORG_ID, isMe: true } },
      },
    );

    const existingResponseId = false &&
      data?.formResponseConnection?.nodes?.[0]?.id;

    const shouldShowSuccess = existingResponseId || hasEntered$.get();

    useEffect(() => {
      jumper.call("layout.applyLayoutConfigSteps", {
        layoutConfigSteps: [
          { action: "useSubject" }, // start with our iframe
          {
            action: "setStyle",
            value: fetching
              ? HIDDEN_STYLE
              : shouldShowSuccess
              ? THANKS_STYLE
              : FORM_STYLE,
          },
        ],
      });
    }, [shouldShowSuccess, fetching]);

    const onSubmit = (e) => {
      e.preventDefault();
      hasEntered$.set(true);
      mutation(FORM_RESPONSE_UPSERT_MUTATION, {
        input: {
          // id: formResponseId$.get(),
          formId: FORM_ID,
          formQuestionAnswers: [
            {
              // id: formQuestionAnswerId$.get(),
              formQuestionId: "a7266780-1964-11ee-bf4c-a5444e22d20b",
              value: email$.get(),
            },
          ],
        },
      });
    };

    return (
      <div className="c-giveaway">
        <div className="header">
          <div className="title">Stanz + Truffle $100 giveaway</div>
        </div>
        <div className="content">
          {
            // isTosVisible$.get() ? <Tos isVisible$={isTosVisible$} />
            fetching
              ? <div className="loading">Loading...</div>
              : (shouldShowSuccess)
              ? (
                <div className="success">
                  <div className="title">
                    You’re entered in the Giveaway!
                  </div>
                  <div className="description">
                    The giveaway will end August 25th @ 11:59 PM PDT and the
                    winner will receive an email from austin@truffle.vip
                  </div>
                </div>
              )
              : (
                <>
                  <div className="description">
                    Enter for a chance to win $100! {isSubscribed$.get()
                      ? "We’ll need an email so we can notify the winner"
                      : "Subscribe to Stanz to enter"}
                  </div>
                  <form onSubmit={onSubmit} className="form">
                    <label className="label">
                      Email
                      <input
                        className="input"
                        placeholder={isSubscribed$.get()
                          ? "Enter your email"
                          : "Subscribe to Stanz first"}
                        value={email$.get()}
                        onInput={(e) => email$.set(e.target.value)}
                        disabled={!isSubscribed$.get()}
                      />
                    </label>
                    <button className="button" disabled={!isSubscribed$.get()}>
                      Enter giveaway
                    </button>
                  </form>
                  <a
                    href="https://stanz.truffle.site/tos"
                    className="terms"
                    target="_blank"
                  >
                    Terms & Conditions
                  </a>
                </>
              )
          }
        </div>
      </div>
    );
  },
);

export default Giveaway;

function Tos({ isVisible$ }) {
  return (
    <div className="c-tos">
      <button className="back" onClick={() => isVisible$.set(false)}>
        Back
      </button>
      <h1>Terms of Service for Truffle Extension Giveaway</h1>
      <ol>
        <li>
          <strong>Eligibility:</strong>{" "}
          The Truffle Extension Giveaway (the "Giveaway") is open to legal
          residents of any country who have reached the age of majority in their
          jurisdiction of residence at the time of entry. Employees, officers,
          and directors of Truffle or its affiliates, subsidiaries, advertising,
          promotion, and fulfillment agencies, and legal advisors, and their
          immediate family members and persons living in their same household
          are not eligible to participate in the Giveaway.
        </li>
        <li>
          <strong>Entry:</strong>{" "}
          To enter the Giveaway, entrants must install the Truffle extension and
          submit their email address through the extension's registration form
          during the Giveaway period. No purchase or payment is necessary to
          enter the Giveaway.
        </li>
        <li>
          <strong>Giveaway Period:</strong>{" "}
          The Giveaway period will begin on the date specified on the Giveaway
          landing page and will end at 11:59 PM Pacific Time on May 23rd, 2023
          (the "Giveaway Period").
        </li>
        <li>
          <strong>Prize:</strong> The prize for the Giveaway will be $100.
        </li>
        <li>
          <strong>Winner Selection and Notification:</strong>{" "}
          The winner will be selected at random from all eligible entries
          received during the Giveaway Period. The winner will be notified by
          email using the email address provided on the registration form within
          five (5) business days of the end of the Giveaway Period. The winner
          must respond to the notification email within five (5) business days
          of the date of the notification email to claim the prize. If the
          winner fails to respond within the designated time frame, an alternate
          winner may be selected.
        </li>
        <li>
          <strong>Taxes:</strong>{" "}
          The winner is solely responsible for any and all federal, state, and
          local taxes and fees associated with the prize.
        </li>
        <li>
          <strong>General Conditions:</strong>{" "}
          By entering the Giveaway, entrants agree to abide by these Terms of
          Service and the decisions of Truffle, which are final and binding.
          Truffle reserves the right to disqualify any entrant who violates
          these Terms of Service or who engages in any fraudulent activity.
          Truffle also reserves the right to modify or terminate the Giveaway at
          any time, for any reason, without notice, and without liability to any
          entrant.
        </li>
        <li>
          <strong>Limitations of Liability:</strong>{" "}
          By entering the Giveaway, entrants agree to release and hold harmless
          Truffle and its affiliates, subsidiaries, advertising, promotion, and
          fulfillment agencies, and legal advisors, and their respective
          officers, directors, employees, and agents, from any and all liability
          for any injuries, losses, or damages of any kind arising from or in
          connection with the Giveaway or any prize won.
        </li>
        <li>
          <strong>Privacy:</strong>{" "}
          Entrants' personal information will be collected, used, and disclosed
          by Truffle in accordance with its privacy policy, which can be found
          at https://truffle.vip/policies.
        </li>
        <li>
          <strong>Governing Law and Jurisdiction:</strong>{" "}
          These Terms of Service will be governed by and construed in accordance
          with the laws of the State of California, without giving effect to any
          choice of law or conflict of law provisions. Any legal proceedings
          arising out of or relating to the Giveaway or these Terms of Service
          will be brought exclusively in the federal or state courts located in
          San Francisco County, California, and entrants consent to the
          jurisdiction of and venue in such courts.
        </li>
        <li>
          <strong>Entire Agreement:</strong>{" "}
          These Terms of Service constitute the entire agreement between the
          entrant and Truffle with respect to the Giveaway and supersede all
          prior or contemporaneous communications and proposals, whether oral or
          written, between the entrant and Truffle.
        </li>
      </ol>
    </div>
  );
}
