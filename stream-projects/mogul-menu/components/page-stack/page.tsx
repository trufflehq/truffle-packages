import {
  classKebab,
  Icon,
  React,
  useEffect,
  useRef,
  useStyleSheet,
} from "../../deps.ts";
import { usePageStack } from "./mod.ts";
import FocusTrap from "../focus-trap/focus-trap.tsx";
import styleSheet from "./page.scss.js";

interface PageProps {
  title?: React.ReactNode;
  headerTopRight?: React.ReactNode;
  onBack?: () => void;
  children?: React.ReactNode;
  shouldShowHeader?: boolean;
  // some pages we don't want the user to be able to dismiss, e.g the onboarding flow
  shouldDisableEscape?: boolean;
  isAnimated?: boolean; // set false if we need to show instantly, eg for onboarding screen
  isFullSize?: boolean;
  footer?: React.ReactNode;
}
export default function Page(props: PageProps) {
  useStyleSheet(styleSheet);
  const { shouldShowHeader } = props;

  // We split out into two separate child components because the FocusTrap requires there to
  // be at least one element in the child tree that's focusable, which isn't the case if it's not
  // rendering the Page header.
  return (
    shouldShowHeader
      ? <FocusedTrappedPage {...props} />
      : <PageBase {...props} />
  );
}

function PageBase(props: PageProps) {
  const {
    title,
    headerTopRight,
    onBack,
    children,
    shouldShowHeader = true,
    shouldDisableEscape = false,
    isAnimated = true,
    isFullSize = false,
    footer,
  } = props;

  const $$backIconRef = useRef<HTMLDivElement>(null);

  const { popPage } = usePageStack();
  const handleKeyPress = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (!shouldDisableEscape) {
      if (
        (ev.key === "Escape" || ev.key === "Enter" || ev.key === "ArrowLeft")
      ) {
        onBack?.() ?? popPage();
      }
    }
  };
  useEffect(() => {
    if ($$backIconRef?.current) {
      $$backIconRef?.current.focus();
    }
  }, []);

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onBack?.() ?? popPage();
  };

  return (
    <div
      className={`c-page ${
        classKebab({
          isFullSize,
          isAnimated,
        })
      }`}
    >
      <div className="body">
        {shouldShowHeader && (
          <div className="header">
            <div className="left">
              <div
                className="back-icon"
                onClick={handleOnClick}
                onKeyDown={handleKeyPress}
                tabIndex={0}
                ref={$$backIconRef}
              >
                <Icon
                  icon="back"
                  color="var(--mm-color-text-bg-primary)"
                  onclick={handleOnClick}
                />
              </div>
              <div className="text">{title}</div>
            </div>
            {headerTopRight && <div className="right">{headerTopRight}</div>}
          </div>
        )}
        <div className="content">{children}</div>
      </div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}

export function FocusedTrappedPage(props: PageProps) {
  const { children } = props;
  return (
    <FocusTrap>
      <PageBase {...props}>
        {children}
      </PageBase>
    </FocusTrap>
  );
}
