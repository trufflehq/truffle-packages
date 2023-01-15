import { Memo, React, useSelector, jumper, useSignal } from "../../deps.ts";
import { ThemeMap, useAlertThemes$ } from "../../shared/mod.ts";

const IS_THEMING_DISABLED_KEY = 'isThemingDisabled'

export function AlertTheme(
  { themes, alertTypes }: {
    themes: ThemeMap;
    /**
     *  FIXME: This currently needs to be limited to one until we support live queries for
     *  either/or queries
     */
    alertTypes: string[];
  },
) {
  const { sourceType$, latestAlert$ } = useAlertThemes$({ themes, alertTypes });

  const isThemingDisabled$ = useSignal(jumper.call("storage.get", {
    key: IS_THEMING_DISABLED_KEY,
  }).then((value) => value === '1'));
  const isThemingDisabled = useSelector(() => isThemingDisabled$.get())

  if (isThemingDisabled) return <></>

  return (
    <div>
      <Memo>
        {() => {
          const sourceType = useSelector(() => sourceType$.get());
          const latestAlert = useSelector(() => latestAlert$.get());
          console.log("latestAlert", latestAlert);
          if (!latestAlert) return <></>;
          const Component = themes[latestAlert?.type].Component;
          return <Component alert={latestAlert} sourceType={sourceType} />;
        }}
      </Memo>
    </div>
  );
}

export default AlertTheme;
