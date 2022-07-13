import { useContext } from "https://npm.tfl.dev/react";
import { snackBarContext } from "../components/legacy/snack-bar-provider/snack-bar-provider.tsx";

export function useSnackBar() {
  const snackBarService = useContext(snackBarContext);
  return snackBarService.enqueueSnackBar.bind(snackBarService);
}
