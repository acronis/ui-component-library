/* eslint-disable no-param-reassign */
import dayjs from 'dayjs';

import { t } from '@/locale';

// TODO replace format with date-fns
const weeks = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const getI18nSettings = () => ({
  dayNamesShort: weeks.map((week) => t(`el.datepicker.weeks.${week}`)),
  dayNames: weeks.map((week) => t(`el.datepicker.weeks.${week}`)),
  monthNamesShort: months.map((month) => t(`el.datepicker.months.${month}`)),
  monthNames: months.map((month, index) => t(`el.datepicker.month${index + 1}`)),
  amPm: ['am', 'pm']
});

export const isDate = function (date) {
  if (date === null || date === undefined) return false;

  return !isNaN(new Date(date).getTime());
};

export const toDate = function (date) {
  return isDate(date) ? new Date(date) : null;
};

export const isDateObject = function (val) {
  return val instanceof Date;
};

export const formatDate = function (date, format) {
  date = toDate(date);
  if (!date) return '';
  return dayjs(date).format(format || 'yyyy-MM-dd', getI18nSettings());
};

export const parseDate = function (string, format) {
  return dayjs(string).format(format || 'yyyy-MM-dd', getI18nSettings());
};

export const getDayCountOfMonth = function (year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30;
  }

  if (month === 1) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return 29;
    }
    return 28;
  }

  return 31;
};

export const getDayCountOfYear = function (year) {
  const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  return isLeapYear ? 366 : 365;
};

export const getFirstDayOfMonth = function (date) {
  const temp = new Date(date.getTime());
  temp.setDate(1);
  return temp.getDay();
};

// see: https://stackoverflow.com/questions/3674539/incrementing-a-date-in-javascript
// {prev, next} Date should work for Daylight Saving Time
// Adding 24 * 60 * 60 * 1000 does not work in the above scenario
export const prevDate = function (date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount);
};

export const nextDate = function (date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
};

export const getStartDateOfMonth = function (year, month) {
  const result = new Date(year, month, 1);
  const day = result.getDay();

  if (day === 0) {
    return prevDate(result, 7);
  }
  return prevDate(result, day);
};

export const range = function (n) {
  // see https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  return Array.from({ length: n }).map((_, i) => i);
};

export const modifyDate = function (date, y, m, d) {
  return new Date(y, m, d, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};

export const clearTime = function (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const prevMonth = function (date) {
  let year = date.getFullYear();
  let month = date.getMonth();
  if (month === 0) {
    year -= 1;
    month = 11;
  } else {
    month -= 1;
  }
  const monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month));
  return modifyDate(date, year, month, monthDate);
};

export const nextMonth = function (date) {
  let year = date.getFullYear();
  let month = date.getMonth();
  if (month === 11) {
    year += 1;
    month = 0;
  } else {
    month += 1;
  }
  const monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month));
  return modifyDate(date, year, month, monthDate);
};

// check for leap year Feburary
export const prevYear = function (date, amount = 1) {
  const year = date.getFullYear() - amount;
  const month = date.getMonth();
  const monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month));
  return modifyDate(date, year, month, monthDate);
};

export const nextYear = function (date, amount = 1) {
  const year = date.getFullYear() + amount;
  const month = date.getMonth();
  const monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month));
  return modifyDate(date, year, month, monthDate);
};

export const minToMax = function (a, b) {
  return a < b ? -1
    : a > b ? 1
    : 0; // eslint-disable-line indent
};

const getMinMaxDate = (minDate, maxDate) => {
  const data = {
    minDate: new Date(minDate.getFullYear(), minDate.getMonth(), 1),
    maxDate: new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0)
  };
  return data;
};

export const getLastSixMonths = (date) => getMinMaxDate(
  new Date(new Date(date).setMonth(date.getMonth() - 6)),
  new Date(new Date(date).setMonth(date.getMonth() - 1))
);

export const getLastThreeMonths = (date) => getMinMaxDate(
  new Date(new Date(date).setMonth(date.getMonth() - 3)),
  new Date(new Date(date).setMonth(date.getMonth() - 1))
);

export const getLastMonth = (value) => {
  const date = prevMonth(value);
  return getMinMaxDate(
    date,
    date
  );
};

export const getNextMonth = (value) => {
  const date = nextMonth(value);
  return getMinMaxDate(
    date,
    date
  );
};

export const getNextThreeMonths = (date) => getMinMaxDate(
  new Date(new Date(date).setMonth(date.getMonth() + 1)),
  new Date(new Date(date).setMonth(date.getMonth() + 3))
);

export const getNextSixMonths = (date) => getMinMaxDate(
  new Date(new Date(date).setMonth(date.getMonth() + 1)),
  new Date(new Date(date).setMonth(date.getMonth() + 6))
);

export const getLastDay = (date) => ({
  minDate: new Date(new Date(date) - 24 * 3600 * 1000),
  maxDate: date
});

export const getLastSevenDays = (date) => ({
  minDate: new Date(new Date(date) - 24 * 3600 * 1000 * 6),
  maxDate: date
});

export const getLastThirtyDays = (date) => ({
  minDate: new Date(new Date(date) - 24 * 3600 * 1000 * 29),
  maxDate: date
});

export const getPreDefinedDates = (type, value) => {
  const date = value ? new Date(value) : new Date();
  let dates;
  switch (type) {
    case 'lastSixMonths':
      dates = getLastSixMonths(date);
      break;
    case 'lastThreeMonths':
      dates = getLastThreeMonths(date);
      break;
    case 'lastMonth':
      dates = getLastMonth(date);
      break;
    case 'nextMonth':
      dates = getNextMonth(date);
      break;
    case 'nextThreeMonths':
      dates = getNextThreeMonths(date);
      break;
    case 'nextSixMonths':
      dates = getNextSixMonths(date);
      break;
    case 'lastday':
    case 'lastDay':
      dates = getLastDay(date);
      break;
    case 'lastseven':
    case 'lastSeven':
      dates = getLastSevenDays(date);
      break;
    case 'lastthirty':
    case 'lastThirty':
      dates = getLastThirtyDays(date);
      break;
    default:
      dates = {
        minDate: date,
        maxDate: date
      };
      break;
  }
  return dates;
};
