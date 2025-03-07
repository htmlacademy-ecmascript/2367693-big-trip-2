import { getRandomElement, getRandomNumber } from '../utils.js';
import { TRIP_DESTINATIONS, TRIP_EVENT_TYPES, MOCK_DATE, DATE_RANGE, TIME_RANGE, PRICE_RANGE, TRIP_OFFERS } from '../const.js';

export const generateTripEvent = () => {
  const destination = getRandomElement(TRIP_DESTINATIONS);
  const eventType = getRandomElement(TRIP_EVENT_TYPES);

  const startTime = `${MOCK_DATE}-${getRandomNumber(DATE_RANGE.MIN_DAY, DATE_RANGE.MAX_DAY)}T${getRandomNumber(TIME_RANGE.MIN_HOUR, TIME_RANGE.MAX_HOUR)}:${getRandomNumber(TIME_RANGE.MIN_MINUTE, TIME_RANGE.MAX_MINUTE)}`;
  const endTime = `${MOCK_DATE}-${getRandomNumber(DATE_RANGE.MIN_DAY, DATE_RANGE.MAX_DAY)}T${getRandomNumber(TIME_RANGE.MIN_HOUR, TIME_RANGE.MAX_HOUR)}:${getRandomNumber(TIME_RANGE.MIN_MINUTE, TIME_RANGE.MAX_MINUTE)}`;

  return {
    id: crypto.randomUUID(),
    eventType,
    destinationId: destination.id,
    startTime,
    endTime,
    price: getRandomNumber(PRICE_RANGE.MIN, PRICE_RANGE.MAX),
    offerIds: TRIP_OFFERS.filter((offer) => offer.eventType === eventType && Math.random() > 0.5).map((offer) => offer.id)
  };
};

// создаёт массив событий
export const generateTripEvents = () => Array.from({ length: 5 }, generateTripEvent);
