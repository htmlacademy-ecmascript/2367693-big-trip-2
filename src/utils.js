import { filterTypeToCallback } from './const.js';
import { filterItems } from './mock/trip-event-mock.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

// Получает случайный элемент из массива
export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Получает случайное число в диапазоне
export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Получает список офферов по типу
export const getOffersByType = (type, offers) => {
  const offerCategory = offers.find((offerGroup) => offerGroup.type.toLowerCase() === type.toLowerCase());
  return offerCategory ? offerCategory.offers : [];
};

// Возвращает массив фильтров с флагами активности и выбора
export const getFilters = (points, currentFilterType) =>
  filterItems.map((filter) => {
    const isDisabled = filter.type !== 'everything'
      ? points.filter(filterTypeToCallback[filter.type]).length === 0
      : points.length === 0;

    return {
      ...filter,
      isDisabled,
      isChecked: filter.type === currentFilterType
    };
  });

// Вычисляет продолжительность события в формате "01D 02H 15M"
export const calculateEventDuration = (dateFrom, dateTo) => {
  const diffInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const dur = dayjs.duration(diffInMinutes, 'minutes');

  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();

  return `${days > 0 ? `${String(days).padStart(2, '0')}D ` : ''}${hours > 0 ? `${String(hours).padStart(2, '0')}H ` : ''}${String(minutes).padStart(2, '0')}M`;
};
