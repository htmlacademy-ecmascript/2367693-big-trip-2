import dayjs from 'dayjs';

export const EventFormMode = {
  EDIT: 'edit',
  CREATE: 'create',
};

export const filterTypeToCallback = {
  everything: () => true,
  future: (point) => dayjs(point.dateFrom).isAfter(dayjs()),
  present: (point) =>
    dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo),
  past: (point) => dayjs(point.dateTo).isBefore(dayjs()),
};
