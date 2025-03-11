const EventFormMode = {
  EDIT: 'edit',
  CREATE: 'create',
};

const TRIP_EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const TRIP_OFFERS = {
  Taxi: [{ id: '1', title: 'Order Uber', price: 20 }],
  Flight: [
    { id: '2', title: 'Upgrade to comfort class', price: 50 },
    { id: '3', title: 'Add luggage', price: 80 },
  ],
  Train: [{ id: '4', title: 'Add meal service', price: 15 }],
  Bus: [{ id: '5', title: 'Extra legroom', price: 10 }],
  Ship: [{ id: '6', title: 'Premium cabin', price: 100 }],
  Sightseeing: [
    { id: '7', title: 'Tour guide', price: 30 },
    { id: '8', title: 'Book tickets', price: 40 },
  ],
};

const TRIP_DESTINATIONS = [
  {
    id: '1',
    name: 'Amsterdam',
    description: 'A beautiful city with canals.',
    pictures: [{ src: 'https://loremflickr.com/248/152?random=1', description: 'Scenic view of Amsterdam' }],
  },
  {
    id: '2',
    name: 'Geneva',
    description: 'The city of diplomacy.',
    pictures: [{ src: 'https://loremflickr.com/248/152?random=2', description: 'Beautiful Geneva cityscape' }],
  },
  {
    id: '3',
    name: 'Chamonix',
    description: 'A paradise for mountaineers.',
    pictures: [{ src: 'https://loremflickr.com/248/152?random=3', description: 'Chamonix mountain view' }],
  }
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
