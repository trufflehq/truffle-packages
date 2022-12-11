import { React, useState, useStyleSheet } from "../../../deps.ts";
import Select from "../../base/select/select.tsx";
import { Collectible, UsernameGradientRedeemData } from '../../../types/mod.ts'
import { ActivatePowerupDialog } from "../activate-powerup-dialog/activate-powerup-dialog.tsx";
import { RedeemableDialog } from '../redeemable-dialog/redeemable-dialog.tsx'
import styleSheet from "./username-gradient-dialog.scss.js";
import ColorOption from "../../base/color-option/color-option.tsx";

interface GradientOption {
  value: string
  name: string
}
export default function UsernameGradientDialog({ redeemableCollectible }: RedeemableDialog) {
  useStyleSheet(styleSheet);

  const gradients: GradientOption[] = redeemableCollectible?.source?.data?.redeemData?.colors;
  const [selectedValue, setSelectedValue] = useState<string>();
  const additionalData = { value: selectedValue };

  const selectChangeHandler = (value: string, _idx: number) => {
    setSelectedValue(value);
  };

  return (
    <ActivatePowerupDialog
      redeemableCollectible={redeemableCollectible}
      additionalData={additionalData}
      isActivateButtonDisabled={!selectedValue}
    >
      <div className="c-username-gradient-body">
        <Select onOptionChanged={selectChangeHandler}>
          <ColorOption disabled defaultOption>
            Select a gradient
          </ColorOption>
          {gradients?.map((gradient) => (
            <ColorOption value={gradient.value} color={gradient.value}>
              {gradient.name}
            </ColorOption>
          ))}
        </Select>
      </div>
    </ActivatePowerupDialog>
  );
}
