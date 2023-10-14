// The logic of this code is based on Scratch's code:
// https://github.com/scratchfoundation/scratch-www/blob/develop/src/lib/select-unit.js

const formatter = new Intl.RelativeTimeFormat("en");

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MONTHS_PER_YEAR = 12;

export const formatRelative = (date: Date) => {
  const now = new Date();
  const distance = date.getTime() - now.getTime();
  const seconds = distance / MILLISECONDS_PER_SECOND;
  const minutes = seconds / SECONDS_PER_MINUTE;
  const hours = minutes / MINUTES_PER_HOUR;
  const days = hours / HOURS_PER_DAY;

  if (Math.abs(seconds) < SECONDS_PER_MINUTE) {
    console.log({ date, now, seconds });
    return formatter.format(Math.trunc(seconds), "seconds");
  }

  if (Math.abs(minutes) < MINUTES_PER_HOUR) {
    return formatter.format(Math.trunc(minutes), "minutes");
  }

  if (Math.abs(hours) < HOURS_PER_DAY) {
    return formatter.format(Math.trunc(hours), "hours");
  }

  let years = date.getFullYear() - now.getFullYear();
  let months = date.getMonth() - now.getMonth() + MONTHS_PER_YEAR * years;

  if (months > 0 && date.getDate() < now.getDate()) {
    months--;
  }
  if (months < 0 && date.getDate() > now.getDate()) {
    months++;
  }

  if (Math.abs(months) < 1) {
    return formatter.format(Math.trunc(days), "days");
  }

  if (
    years > 0 &&
    (date.getMonth() < now.getMonth() ||
      (date.getMonth() === now.getMonth() && date.getDate() < now.getDate()))
  ) {
    years--;
  }
  if (
    years < 0 &&
    (date.getMonth() > now.getMonth() ||
      (date.getMonth() === now.getMonth() && date.getDate() > now.getDate()))
  ) {
    years++;
  }

  if (Math.abs(years) < 1) {
    return formatter.format(months, "months");
  }
  return formatter.format(years, "years");
};
