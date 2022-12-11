import { React, useEffect, useRef } from "../../deps.ts";
interface NewWindowProps {
  onClose: () => void;
  url?: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export default function NewWindow(props: NewWindowProps) {
  const newWindow = useRef(window);

  useEffect(() => {
    if (newWindow.current && props?.url) {
      newWindow.current = window.open(
        props?.url,
        "_blank",
        `width=${props.width},height=${props.height},left=${props.left},right=${props.right},top=${props.top},bottom=${props.bottom}`,
      ) as (Window & typeof globalThis);

      const timer = setInterval(function () {
        if (newWindow.current?.closed) {
          clearInterval(timer);
          props.onClose();
        }
      }, 250);

      const curWindow = newWindow.current;
      return () => curWindow?.close();
    }
  }, []);

  return <></>;
}
