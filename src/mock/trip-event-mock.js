import { getRandomElement, getRandomNumber } from '../utils.js';
import { TRIP_DESTINATIONS, TRIP_OFFERS, DATE_RANGE, TIME_RANGE, PRICE_RANGE, MOCK_DATE } from '../const.js';

// Генерация случайных фотографий с заглушками
function generateDestinationPictures() {
  const pictureCount = getRandomNumber(1, 5); // 1-5 картинок
  return Array.from({ length: pictureCount }, () => ({
    src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 1000)}`,
    description: 'Random travel photo',
  }));
}

function generateTripEvent(eventType) {
  const availableOffers = TRIP_OFFERS[eventType] || [];
  const offerIds = availableOffers
    .filter(() => Math.random() > 0.5)
    .map((offer) => offer.id);

  // Генерация даты и времени в корректном формате
  const randomDay = getRandomNumber(DATE_RANGE.MIN_DAY, DATE_RANGE.MAX_DAY);
  const startHour = getRandomNumber(TIME_RANGE.MIN_HOUR, TIME_RANGE.MAX_HOUR);
  const startMinute = getRandomNumber(TIME_RANGE.MIN_MINUTE, TIME_RANGE.MAX_MINUTE);
  const startTime = new Date(`${MOCK_DATE}-${String(randomDay).padStart(2, '0')}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`);

  const duration = getRandomNumber(30, 300); // Длительность события от 30 до 300 минут
  const endTime = new Date(startTime.getTime() + duration * 60000);

  return {
    eventType,
    destinationId: getRandomElement(TRIP_DESTINATIONS).id,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    price: getRandomNumber(PRICE_RANGE.MIN, PRICE_RANGE.MAX),
    offerIds,
    isFavorite: Math.random() > 0.5, //
    pictures: generateDestinationPictures(),
  };
}

function generateTripEvents(count = 10) {
  return Array.from({ length: count }, () => generateTripEvent(getRandomElement(Object.keys(TRIP_OFFERS))));
}

export { generateTripEvents };
