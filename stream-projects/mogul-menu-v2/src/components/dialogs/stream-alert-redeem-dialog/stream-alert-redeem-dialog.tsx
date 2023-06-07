import { React, TextField, useState, useStyleSheet } from "../../../deps.ts";
import { ActivatePowerupDialog } from "../activate-powerup-dialog/activate-powerup-dialog.tsx";
import { RedeemableDialog } from "../redeemable-dialog/redeemable-dialog.tsx";
import styleSheet from "./stream-alert-redeem-dialog.scss.js";

export default function StreamAlertRedeemDialog(
  { redeemableCollectible }: RedeemableDialog,
) {
  useStyleSheet(styleSheet);

  const [message, setMessage] = useState("");
  const additionalData = { message };
  const isEmpty = message.length === 0;

  return (
    <ActivatePowerupDialog
      redeemableCollectible={redeemableCollectible}
      isActivateButtonDisabled={isEmpty}
      additionalData={additionalData}
    >
      <div className="c-stream-alert-redeem-dialog-body">
        <TextField
          placeholder="Enter a message to show on stream"
          value={message}
          onInput={(e: any) => setMessage(e.target?.value)}
        />
      </div>
    </ActivatePowerupDialog>
  );
}
