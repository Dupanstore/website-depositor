export function formatTime(dateTime: string) {
  const dateObj = new Date(dateTime);

  const hours = ("0" + dateObj.getHours()).slice(-2);
  const minutes = ("0" + dateObj.getMinutes()).slice(-2);
  const seconds = ("0" + dateObj.getSeconds()).slice(-2);

  return `${hours}:${minutes}:${seconds}`;
}
