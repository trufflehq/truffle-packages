import {
  classKebab,
  LabelPrimitive,
  legend,
  Observable,
  React,
  useSelector,
  useStyleSheet,
} from "../../../deps.ts";
import stylesheet from "./text-area.scss.js";

export interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  value$: Observable<string>;
  error$?: Observable<string>;
  placeholder?: string;
  label?: string;
  css?: React.CSSProperties;
}

export default function TextArea(
  { value$, error$, placeholder, label, css, ...props }: TextAreaProps,
) {
  useStyleSheet(stylesheet);
  const error = useSelector(() => error$?.get());
  return (
    <div
      className={`c-legend-text-area ${
        classKebab({
          hasError: !!error,
        })
      }`}
    >
      {label && (
        <LabelPrimitive.Root htmlFor="textarea" className="label">{label}</LabelPrimitive.Root>
      )}
      <legend.textarea
        style={css}
        placeholder={placeholder}
        id="textarea"
        value$={value$}
        {...props}
      />
    </div>
  );
}
