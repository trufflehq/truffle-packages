import { Icon, React, useState, useEffect, useStyleSheet } from "../../../deps.ts";
import styleSheet from "./select.scss.js";

// the Option component should be used as the children for this component
export default function Select({
  children,
  onOptionChanged,
}: {
  children?: any;
  onOptionChanged?: (value: string, idx: number) => void;
}) {
  useStyleSheet(styleSheet);
  const [isShowingDropdown, setIsShowingDropdown] = useState(false);
  const toggleDropdown = () => setIsShowingDropdown((prev) => !prev);

  const _children = Array.isArray(children) ? children.flat() : [children];

  const [selectedIdx, setSelectedIdx] = useState(() => {
    const defaultIdx = _children.findIndex((child) => child.props?.default);
    return defaultIdx !== -1 ? defaultIdx : 0;
  });

  const optionClickHandler = (idx, value) => {
    setSelectedIdx(idx);
    setIsShowingDropdown(false);
    onOptionChanged?.(value, idx);
  };

  const handleEscape = (ev: KeyboardEvent) => {
    if(ev.key === 'Escape') {
      setIsShowingDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEscape, false)

    return () => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  }, [])

  return (
    <div className="c-select">
      <div className="selected-option" onClick={toggleDropdown}>
        {_children[selectedIdx]}
        <div className="down-arrow">
          <Icon icon="chevronDown" />
        </div>
      </div>
      {isShowingDropdown && (
        <div className="dropdown">
          {_children.map((child, idx) => (
            <div
              className={`option ${child.props?.disabled && "disabled"}`}
              onClick={() => {
                if (!child.props?.disabled) {
                  optionClickHandler(idx, child.props?.value);
                }
              }}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
