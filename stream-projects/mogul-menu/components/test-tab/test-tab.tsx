import { React, useEffect, useSelector, useSignal, useState } from "../../deps.ts";
import { useCurrentTab, useTabButton, useTabSlug } from "../tabs/mod.ts";
import { getMenuPosition, useMenu } from "../menu/mod.ts";
import { useSnackBar } from "../snackbar/mod.ts";
import Button from "../base/button/button.tsx";
import Input from "../base/input/input.tsx";
import { SnackBar } from "../snackbar/mod.ts";
import Dialog from "../base/dialog/dialog.tsx";
import Select from "../base/select/select.tsx";
import Option from "../base/option/option.tsx";
import ColorOption from "../base/color-option/color-option.tsx";

import { usePageStack } from "../page-stack/mod.ts";

import ActionBanner from "../action-banner/action-banner.tsx";
import { useActionBanner } from "../action-banner/mod.ts";
import { useDialog } from "../base/dialog-container/dialog-service.ts";
import DefaultDialogContentFragment from "../dialogs/content-fragments/default/default-dialog-content-fragment.tsx";
import Switch from "../base/switch/switch.tsx";
import { Page } from "../page-stack/mod.ts";
import { useFcmTokenManager } from "../../shared/util/firebase/fcm.ts";
import { useUserKV } from "../../shared/mod.ts";

const TAB_BAR_BUTTON = "tab-bar-button";

export default function TestTab() {
  const enqueueSnackBar = useSnackBar();
  const [count, setCount] = useState(0);
  const [isSelected, setSelected] = useState(false);

  const tabSlug = useTabSlug();
  const { setTabBadge, setTabText, isActive, text } = useCurrentTab();

  const { pushPage } = usePageStack();
  const { pushDialog } = useDialog();

  const { displayActionBanner, removeActionBanner } = useActionBanner();
  const gradients = [
    { name: "gradient1", value: "blue" },
    { name: "gradient2", value: "red" },
    { name: "gradoemt3", value: "orange" },
  ];
  const [selectedValue, setSelectedValue] = useState();
  const { state: menuState, updateMenuPosition } = useMenu();
  const [menuPositionValue, setMenuPositionValue] = useState(
    getMenuPosition(menuState),
  );
  const additionalData = { value: selectedValue };

  const selectChangeHandler = (value, _idx) => {
    setSelectedValue(value);
  };

  const menuPositionHandler = (value) => {
    // console.log('menuPositionHandler', value)
    setMenuPositionValue(value);
    updateMenuPosition(value);
  };
  const snackBarHandler = () => {
    console.log("enqueueing snackbar");
    enqueueSnackBar(
      <SnackBar message={`Congrats! You won. ${count}`} value="1000 cp" />,
    );
    setCount((prev) => prev + 1);
    setSelected((prev) => !prev);
  };

  const tabNameHandler = () => {
    setTabText(`Home (${count})`);
    setTabBadge(isSelected);
    setCount((prev) => prev + 1);
    setSelected((prev) => !prev);
  };

  const pushPageHandler = () => {
    pushPage(<Page>What up</Page>);
  };

  const actionBannerHandler = () => {
    const actionBannerId = displayActionBanner(
      <ActionBanner
        action={<Button onClick={() => removeActionBanner(actionBannerId)}></Button>}
      >
        Finish setting up your account
      </ActionBanner>,
    );
  };

  // this uses the mogul-menu dialog service
  const toggleDialogHandler = () => {
    pushDialog(
      <Dialog
        actions={[
          <Button style="bg-tertiary">Close</Button>,
          <Button style="primary">Accept</Button>,
        ]}
      >
        <DefaultDialogContentFragment
          imageUrl="https://cdn.bio/ugc/collectible/d57969e0-c675-11ec-8e89-9f132b527070.svg"
          primaryText="Hello"
          secondaryText="How are you?"
        />
      </Dialog>,
    );
  };

  const { addButton, removeButton } = useTabButton();
  const removeButtonHandler = () => removeButton(TAB_BAR_BUTTON);
  const addButtonHandler = () => {
    addButton(
      TAB_BAR_BUTTON,
      <Button onClick={removeButtonHandler}>Remove button</Button>,
    );
  };

  const { requestNotificationPermission, fcmToken } = useFcmTokenManager();
  useEffect(() => {
    console.log("[mm] new fcm token", fcmToken);
  }, [fcmToken]);

  const userKVInput$ = useSignal("");
  const { value$: userKVValue$, setUserKV } = useUserKV("mogul-menu:test-key");

  return (
    <div className="z-home-tab">
      <div className="truffle-text-header-1">Tab slug: {tabSlug}</div>
      <div className="truffle-text-header-1">Tab name: {text}</div>
      <div className="truffle-text-header-1">
        Tab isActive: {String(isActive)}
      </div>
      <div>
        <Button onClick={snackBarHandler}>Enqueue snackbar</Button>
        <Button onClick={tabNameHandler}>Set tab name</Button>
        <Button onClick={pushPageHandler}>Push page</Button>
        <Button onClick={actionBannerHandler}>Show action banner</Button>
        <Button onClick={toggleDialogHandler}>Show dialog</Button>
        <Button onClick={addButtonHandler}>Add tab bar button</Button>
        <Button onClick={requestNotificationPermission}>
          Request notification perms
        </Button>
      </div>
      <div>
        <Switch value={true} />
      </div>
      <div>
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
      <div>
        <Select onOptionChanged={menuPositionHandler}>
          <Option
            disabled={true}
            value={menuPositionValue}
            defaultOption={true}
          >
            {menuPositionValue}
          </Option>
          {["top-right", "bottom-right"].map((position) => (
            <Option value={position}>{position}</Option>
          ))}
        </Select>
      </div>
      <div>
        <h3>User KV</h3>
        <Input label="Value" value$={userKVInput$} />
        <div>Value: {userKVValue$.get()}</div>
        <div>
          <Button onClick={() => setUserKV(userKVInput$.get())}>Set user KV</Button>
        </div>
      </div>
    </div>
  );
}
