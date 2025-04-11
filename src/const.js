import dayjs from 'dayjs';

export const EventFormMode = {
  EDIT: 'edit',
  CREATE: 'create',
};

export const Filters = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const filterTypeToCallback = {
  [Filters.EVERYTHING]: () => true,
  [Filters.FUTURE]: (point) => dayjs(point.dateFrom).isAfter(dayjs()),
  [Filters.PRESENT]: (point) =>
    dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs()),
  [Filters.PAST]: (point) => dayjs(point.dateTo).isBefore(dayjs()),
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};
