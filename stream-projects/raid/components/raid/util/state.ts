import { signal } from "../../../deps.ts";

interface RaidState {
  id: string | undefined;
  isShowing: boolean;
}

export const raidState$ = signal<RaidState>({
  id: undefined,
  isShowing: false,
});
