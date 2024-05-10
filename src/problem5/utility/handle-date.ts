export const getTimeYesterday = () => {
  // Get the current date
  const currentDate = new Date();

  // Calculate the start of today (midnight)
  const startOfToday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    0,
    0,
    0,
    0,
  );

  // Calculate the end of yesterday (one millisecond before midnight)
  const endOfYesterday = new Date(startOfToday.getTime());

  // Calculate the start of yesterday (midnight)
  const startOfYesterday = new Date(endOfYesterday);
  startOfYesterday.setDate(endOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  // Get Unix timestamps (in seconds) for start and end of yesterday, and current timestamp
  const startOfYesterdayUnixTimestamp = Math.floor(
    startOfYesterday.getTime() / 1000,
  );
  const endOfYesterdayUnixTimestamp = Math.floor(
    endOfYesterday.getTime() / 1000,
  );
  const currentUnixTimestamp = Math.floor(currentDate.getTime() / 1000);

  return [
    startOfYesterdayUnixTimestamp,
    endOfYesterdayUnixTimestamp,
    currentUnixTimestamp,
  ];
};


export const getDDMMYYYCurrentDate = () => {
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = currentDate.getFullYear();

  return `${day}-${month}-${year}`;
}
