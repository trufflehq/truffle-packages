export const ONE_MINUTE_S = 60;
export const ONE_HOUR_S = 3600;
export const ONE_DAY_S = 3600 * 24;
export const ONE_WEEK_S = 3600 * 24 * 7;

export const ONE_SECOND_MS = 1000;
export const ONE_MINUTE_MS = 60 * 1000;
export const ONE_HOUR_MS = 3600 * 1000;

// this function is only safe for generating
// small numbers of ids; don't trust this to
// be globally unique
export const uniqueId = () => Math.random().toString(16).slice(2);

export function pad(num: number, size = 2) {
  let _num = num.toString();
  while (_num.length < size) _num = `0${num}`;
  return _num;
}

export function fromNowSeconds(seconds: number, suffix = "") {
  if (isNaN(seconds)) {
    return "...";
  } else if (seconds < 30) {
    return "<30s";
  } else if (seconds < ONE_MINUTE_S) {
    return Math.round(seconds) + "s" + suffix;
  } else if (seconds < ONE_HOUR_S) {
    return Math.round(seconds / ONE_MINUTE_S) + "min" + suffix;
  } else if (seconds <= ONE_DAY_S) {
    return Math.round(seconds / ONE_HOUR_S) + "h" + suffix;
  } else if (seconds <= ONE_WEEK_S) {
    return Math.round(seconds / ONE_DAY_S) + "d" + suffix;
  } else {
    return Math.round(seconds / ONE_WEEK_S) + "w" + suffix;
  }
}

export function fromNow(date: Date, suffix = "") {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const seconds = Math.abs((Date.now() - date.getTime()) / 1000);
  return fromNowSeconds(seconds, suffix);
}

export function fromNowLongSeconds(seconds: number, suffix = "") {
  const timeStr = (val: number, unit: string) => {
    return `${val} ${unit}${val > 1 ? "s" : ""}`;
  };

  if (isNaN(seconds)) {
    return "...";
  } else if (seconds < 30) {
    return "<30s";
  } else if (seconds < ONE_MINUTE_S) {
    return timeStr(Math.round(seconds), "second") + suffix;
  } else if (seconds < ONE_HOUR_S) {
    return timeStr(Math.round(seconds / ONE_MINUTE_S), "minute") + suffix;
  } else if (seconds <= ONE_DAY_S) {
    return timeStr(Math.round(seconds / ONE_HOUR_S), "hour") + suffix;
  } else if (seconds <= ONE_WEEK_S) {
    return timeStr(Math.round(seconds / ONE_DAY_S), "day") + suffix;
  } else {
    return timeStr(Math.round(seconds / ONE_WEEK_S), "week") + suffix;
  }
}

export function fromNowLong(date: Date, suffix = "") {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const seconds = Math.abs((Date.now() - date.getTime()) / 1000);
  return fromNowLongSeconds(seconds, suffix);
}

export const secondsSince = (date: Date) => {
  return Math.floor((Date.now() - date.getTime()) / 1000);
};

export const isGoogleChrome = window.navigator.vendor === "Google Inc.";
