import { useContext } from "https://npm.tfl.dev/react";
import { snackBarContext } from "../components/snack-bar-provider/snack-bar-provider.jsx";

export function useSnackBar() {
  const snackBarService = useContext(snackBarContext);
  return snackBarService.enqueueSnackBar.bind(snackBarService);
}
