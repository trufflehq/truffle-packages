import React from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";

import styleSheet from "./tos.scss.js";

export default function Tos({ isVisible$ }) {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Roboto"]);

  return (
    <div className="c-tos">
      {/* <button className="back" onClick={() => isVisible$.set(false)}>Back</button> */}
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
          To enter the Giveaway, entrants must install the Truffle extension, be
          subscribed to Stanz on YouTube, and submit their email address through
          the extension's registration form during the Giveaway period. No
          purchase or payment is necessary to enter the Giveaway.
        </li>
        <li>
          <strong>Giveaway Period:</strong>{" "}
          The Giveaway period will begin on the date specified on the Giveaway
          landing page and will end at 11:59 PM Pacific Time on August 27, 2023
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
