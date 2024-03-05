export function formatDate(date: string) {
  const initDate = new Date(date);
  const year = initDate.getFullYear();
  const month = (initDate.getMonth() + 1).toString().padStart(2, "0");
  const day = initDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}
