export default function css(strings, ...values) {
  let cssString = "";

  strings.forEach((str, i) => {
    const value = values[i];
    cssString += str;
    if (value) {
      cssString += value;
    }
  });

  const styleSheet = new CSSStyleSheet();
  // Node/dom shim doesn't seem to support this atm
  styleSheet.replaceSync?.(cssString);

  return styleSheet;
}
