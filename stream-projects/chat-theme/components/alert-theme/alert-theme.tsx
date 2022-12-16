import { Memo, React, useSelector } from "../../deps.ts";
import { ThemeMap, useAlertThemes$ } from "../../shared/mod.ts";

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
