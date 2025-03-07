const EventFormMode = {
  EDIT: 'edit',
  CREATE: 'create',
};

const TRIP_EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const TRIP_DESTINATIONS = [
  { id: '1', name: 'Amsterdam', description: 'A beautiful city with canals.', pictures: ['https://loremflickr.com/248/152?random=1'] },
  { id: '2', name: 'Geneva', description: 'The city of diplomacy.', pictures: ['https://loremflickr.com/248/152?random=2'] },
  { id: '3', name: 'Chamonix', description: 'A paradise for mountaineers.', pictures: ['https://loremflickr.com/248/152?random=3'] }
];

const TRIP_OFFERS = [
  { id: '1', eventType: 'taxi', title: 'Order Uber', price: 20 },
  { id: '2', eventType: 'flight', title: 'Upgrade to comfort class', price: 50 },
  { id: '3', eventType: 'train', title: 'Add meal service', price: 15 }
];

// Базовая дата для генерации мок-данных
const MOCK_DATE = '2025-03';

// Диапазон дней (например, с 10 по 20 марта)
const DATE_RANGE = {
  MIN_DAY: 10,
  MAX_DAY: 20,
};

// Диапазон времени (часы и минуты)
const TIME_RANGE = {
  MIN_HOUR: 0,
  MAX_HOUR: 23,
  MIN_MINUTE: 0,
  MAX_MINUTE: 59,
};

// Диапазон цен
const PRICE_RANGE = {
  MIN: 10,
  MAX: 500,
};

export { EventFormMode, TRIP_EVENT_TYPES, TRIP_DESTINATIONS, TRIP_OFFERS, MOCK_DATE, DATE_RANGE, TIME_RANGE, PRICE_RANGE };
