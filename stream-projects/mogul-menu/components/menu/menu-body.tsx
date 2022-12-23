import { ErrorBoundary, React, useStyleSheet } from "../../deps.ts";
import styleSheet from "./menu.scss.js";
import DraggableMenu from "./draggable-menu/draggable-menu.tsx";
import NativeMenu from "./native-menu/native-menu.tsx";
import Tabs from "../tabs/tabs.tsx";
import TabBar from "../tab-bar/tab-bar.tsx";
import PageStack from "../page-stack/page-stack.tsx";
import { SnackBarContainer } from "../snackbar/mod.ts";
import { useInvalidateAllQueriesListener, useIsNative } from "../../shared/mod.ts";
import ExtensionIcon from "./extension-icon/extension-icon.tsx";
import { useOnboarding } from "../onboarding/mod.ts";
import { ActionBannerContainer } from "../action-banner/mod.ts";
import DialogContainer from "../base/dialog-container/dialog-container.tsx";
import { MogulMenuProps } from "./menu.tsx";
import MenuLoading from "../menu-loading/menu-loading.tsx";

export default function BrowserExtensionMenuBody(props: MogulMenuProps) {
  useStyleSheet(styleSheet);
  useInvalidateAllQueriesListener();
  useOnboarding();
  const isNative = useIsNative();

  return isNative ? <NativeMenu {...props} /> : <WebMenu {...props} />;
}

function WebMenu(props: MogulMenuProps) {
  return (
    <DraggableMenu {...props}>
      <div className="inner">
        <MenuLoading />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="bottom">
            <TabBar />
            <ExtensionIcon />
          </div>
          <div className="body">
            <DialogContainer />
            <PageStack />
            <ActionBannerContainer />
            <SnackBarContainer />
            <Tabs tabs={props.tabs} />
          </div>
        </ErrorBoundary>
      </div>
    </DraggableMenu>
  );
}

function ErrorFallback({ error }) {
  return (
    <div style={{ padding: "16px" }}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  );
}
