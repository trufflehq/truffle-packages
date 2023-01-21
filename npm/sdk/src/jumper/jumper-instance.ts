// @ts-nocheck

// TODO: simplify jumper so we can simplify this file
import Jumper from "@trufflehq/jumper";

const LOCAL_STORAGE_PREFIX = "truffle";
const PLATFORMS = {
  APP: "app",
  WEB: "web",
};

const isSsr = typeof document === "undefined" ||
  globalThis?.process?.release?.name === "node" ||
  globalThis?.Deno;

class JumperInstance {
  constructor() {
    if (!isSsr) {
      // TODO: setup service worker so it actually responds and doesn't timeout
      // when you're enabling this, test that it doesn't slow down the
      // first browsercomms call in browser extension
      const shouldConnectToServiceWorker = false;
      // const shouldConnectToServiceWorker = navigator.serviceWorker &&
      //   typeof document !== 'undefined' &&
      //   window.location.protocol !== 'http:'
      this.jumper = new Jumper({
        shouldConnectToServiceWorker,
        // TODO: check isParentValid
      });

      this.appResumeHandler = null;
    }
  }

  private jumper: Jumper | undefined;
  private appResumeHandler: (() => void) | null | undefined;

  call = (...args) => {
    if (isSsr) {
      // throw new Error 'Comms called server-side'
      return console.log("Comms called server-side");
    }

    return this.jumper.call(...args)
      .catch((err) => {
        // if we don't catch, zorium freaks out if a jumper call is in state
        // (infinite errors on page load/route)
        // FIXME: re-enable
        // console.log('missing jumper call', args)
        if (!err.message?.startsWith?.("Method not found")) {
          console.log(err);
        }
        return null;
      });
  };

  callWithError = (...args) => {
    if (isSsr) {
      // throw new Error 'Comms called server-side'
      return console.log("Comms called server-side");
    }

    return this.jumper.call(...Array.from(args || []));
  };

  listen = () => {
    if (isSsr) {
      throw new Error("Comms called server-side");
    }

    this.jumper.listen();

    this.jumper.on("auth.getStatus", this.authGetStatus);
    this.jumper.on("env.getPlatform", this.getPlatform);

    // fallbacks
    this.jumper.on("app.onResume", this.appOnResume);

    this.jumper.on(
      "networkInformation.onOnline",
      this.networkInformationOnOnline,
    );
    this.jumper.on(
      "networkInformation.onOffline",
      this.networkInformationOnOffline,
    );
    this.jumper.on(
      "networkInformation.onOnline",
      this.networkInformationOnOnline,
    );

    this.jumper.on("storage.get", this.storageGet);
    this.jumper.on("storage.set", this.storageSet);

    return this.jumper.on(
      "browser.openWindow",
      ({ url, target, options }) => window?.open(url, target, options),
    );
  };

  /*
  @typedef AuthStatus
  @property {String} accessToken
  @property {String} userId
  */

  /*
  @returns {Promise<AuthStatus>}
  */
  authGetStatus = async () => {
    const user = await this.model.user.getMe().take(1).toPromise();
    return {
      // Temporary
      accessToken: user.id,

      userId: user.id,
    };
  };

  getPlatform = (param) => {
    // const { userAgent } = navigator
    switch (false) {
      // case !Environment.isNativeApp({ userAgent }):
      //   return this.PLATFORMS.APP
      default:
        return PLATFORMS.WEB;
    }
  };

  isChrome() {
    return globalThis?.navigator?.userAgent.match(/chrome/i);
  }

  appOnResume = (callback) => {
    if (this.appResumeHandler) {
      window.removeEventListener("visibilitychange", this.appResumeHandler);
    }

    this.appResumeHandler = function () {
      if (!document.hidden) {
        return callback();
      }
    };

    return window.addEventListener("visibilitychange", this.appResumeHandler);
  };

  networkInformationOnOnline(fn) {
    return window.addEventListener("online", fn);
  }

  networkInformationOnOffline(fn) {
    return window.addEventListener("offline", fn);
  }

  storageGet = ({ key }) => {
    return window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}:${key}`);
  };

  storageSet = ({ key, value }) => {
    window.localStorage.setItem(`${LOCAL_STORAGE_PREFIX}:${key}`, value);
  };
}

export const jumper = new JumperInstance();
if (!isSsr) {
  // HACK: only want 1 jumper listening even if this file somehow ends up
  // loaded by browser/bundle multiple times.
  // TODO: restructure jumper to automatically listen and only do so once per layer
  window._isTruffleJumperListening = true;
  jumper.listen();
}
