export function getMashTimeRemaining(pollEndTime: Date) {
  const start = new Date().getTime();
  const end = new Date(pollEndTime).getTime();
  const timeRemaining = (end - start) / 1000;

  return timeRemaining ?? 0;
}
