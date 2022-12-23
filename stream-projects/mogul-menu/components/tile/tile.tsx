import {
  classKebab,
  Icon,
  ImageByAspectRatio,
  React,
  Ripple,
  useSignal,
  useStyleSheet,
} from "../../deps.ts";
import styleSheet from "./tile.scss.js";

const TRASH_ICON_URL =
  "https://cdn.bio/assets/images/features/browser_extension/trash-red.svg";
const EYE_OPEN_ICON_URL =
  "https://cdn.bio/assets/images/features/browser_extension/eye-open-red.svg";
const EYE_CLOSED_ICON_URL =
  "https://cdn.bio/assets/images/features/browser_extension/eye-closed-red.svg";
export default function Tile(props) {
  useStyleSheet(styleSheet);
  const {
    icon,
    iconViewBox,
    headerText,
    content: Content,
    className,
    color,
    onClick,
    action,
    isHidden,
  } = props;
  let { textColor } = props;
  if (!textColor) textColor = "var(--mm-color-text-bg-primary)";

  return (
    <div
      className={`c-tile ${className}`}
    >
      <div
        className={`inner ${
          classKebab({
            isHidden: isHidden,
            clickable: !!onClick,
          })
        }`}
        onClick={onClick}
      >
        <TileHeader
          backgroundColor={color}
          textColor={textColor}
          borderColor={color}
          icon={icon}
          iconViewBox={iconViewBox}
          iconColor={color}
          text={headerText}
        />
        <Content />
        {onClick && <Ripple color={color} />}
      </div>
      {action && <div className="action">{action}</div>}
    </div>
  );
}

export function RemoveButton(
  { onRemove, removeTooltip, shouldHandleLoading }: {
    onRemove: () => void;
    removeTooltip?: string;
    shouldHandleLoading: boolean;
  },
) {
  const isRemovingLoading$ = useSignal(false);
  const removeHandler = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (shouldHandleLoading) {
      isRemovingLoading$.set(true);
    }

    await onRemove();

    if (shouldHandleLoading) {
      isRemovingLoading$.set(false);
    }
  };

  return (
    <div className="c-action-button remove" onClick={removeHandler}>
      {removeTooltip &&
        (
          <div className="text">
            {removeTooltip}
          </div>
        )}
      {isRemovingLoading$.get!() ? "..." : (
        <ImageByAspectRatio
          imageUrl={TRASH_ICON_URL}
          aspectRatio={1}
          width={20}
          height={20}
        />
      )}
    </div>
  );
}

export function HideShowButton(
  { onToggle, isToggled }: { onToggle: () => void; isToggled: boolean },
) {
  return (
    <ToggleButton
      onToggle={onToggle}
      text={isToggled ? "Hide" : "Unhide"}
      isToggled={isToggled}
      toggledSrc={EYE_OPEN_ICON_URL}
      untoggledSrc={EYE_CLOSED_ICON_URL}
    />
  );
}

export function ToggleButton(
  { onToggle, text, isToggled, toggledSrc, untoggledSrc }: {
    onToggle: () => void;
    text: string;
    isToggled: boolean;
    toggledSrc: string;
    untoggledSrc: string;
  },
) {
  return (
    <div className="c-action-button" onClick={onToggle}>
      <div className="text">
        {text}
      </div>
      <ImageByAspectRatio
        imageUrl={isToggled ? toggledSrc : untoggledSrc}
        aspectRatio={1}
        width={20}
        height={20}
      />
    </div>
  );
}

function TileHeader({
  backgroundColor,
  textColor,
  borderColor,
  text,
  icon,
  iconViewBox,
  iconColor,
}: {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  text: string;
  icon: string;
  iconViewBox: number;
  iconColor: string;
}) {
  return (
    <div
      className="header"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <div
        className="icon"
        style={{
          borderColor,
        }}
      >
        <Icon icon={icon} viewBox={iconViewBox} size="24px" color={iconColor} />
      </div>
      <div className="text">{text}</div>
    </div>
  );
}
