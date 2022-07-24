export const pad = (num: number) => (num < 10 ? `0${num}` : `${num}`);
export const amPm = (hour: number) => (hour < 12 ? "AM" : "PM");
export const twelveHour = (hours: number) => (hours % 12 === 0 ? 12 : hours % 12);
export const formatDate = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${twelveHour(
    date.getHours()
  )}:${pad(date.getMinutes())} ${amPm(date.getHours())}`;