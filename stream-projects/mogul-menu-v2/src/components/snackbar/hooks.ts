import { useMenu } from "../menu/mod.ts";

export function useSnackBar() {
  const { enqueueSnackBar } = useMenu();
  return enqueueSnackBar;
}
