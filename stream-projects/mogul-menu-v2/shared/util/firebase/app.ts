import { TRUFFLE_FIREBASE_CONFIG } from "./config.ts";
import {
  getFirebaseApp,
  initializeFirebaseApp,
  useEffect,
  useState,
} from "../../../deps.ts";

export function useFirebase() {
  const [firebaseApp, setFirebaseApp] = useState();

  // set the firebase app on load
  useEffect(() => {
    try {
      // try to get the existing app if it has already been initialized
      const existingApp = getFirebaseApp();
      setFirebaseApp(existingApp);
    } catch {
      // if the app hasn't been initialized, initialize it
      const app = initializeFirebaseApp(TRUFFLE_FIREBASE_CONFIG);
      setFirebaseApp(app);
    }
  }, []);

  return { firebaseApp };
}
