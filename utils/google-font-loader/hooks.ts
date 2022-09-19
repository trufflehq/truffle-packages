import { useEffect } from "./deps.ts";

export function useGoogleFontLoader(
  callback: () => string[],
  dependencies: string[] = [],
) {
  useEffect(() => {
    const fontFamilies = callback();
    if (!fontFamilies?.length) {
      return;
    }
    const family = fontFamilies.join("&family=").replace(/ /g, "+");
    const $$link = document.createElement("link");
    $$link.rel = "stylesheet";
    $$link.href =
      `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`;
    document.head.appendChild($$link);
    return () => {
      document.head.removeChild($$link);
    };
  }, dependencies);

  return null;
}
