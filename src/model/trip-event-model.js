import { generateTripEvents } from '../mock/trip-event-mock.js';
import { TRIP_DESTINATIONS, TRIP_OFFERS } from '../const.js';
import dayjs from 'dayjs';

export default class TripEventModel {
  constructor() {
    // Генерируем мок-данные и корректно связываем `destination`, `offers` и `isFavorite`
    this.tripEvents = generateTripEvents().map((event) => {
      const destination = TRIP_DESTINATIONS.find((dest) => dest.id === event.destinationId) || {
        name: 'Unknown',
        pictures: [{ src: 'https://via.placeholder.com/248x152', description: 'Placeholder image' }] // Заглушка
      };

      return {
        ...event,
        destination,
        offers: (TRIP_OFFERS[event.eventType] || []).filter((offer) => event.offerIds.includes(offer.id)), // выбираем только нужные офферы
        isFavorite: event.isFavorite ?? false, // Поддержка избранных событий
        startTime: dayjs(event.startTime), // Гарантируем корректный формат даты
        endTime: dayjs(event.endTime), // Гарантируем корректный формат даты
      };
    });
  }

  getTripEvents() {
    return this.tripEvents;
  }

  getDestinations() {
    return TRIP_DESTINATIONS;
  }

  getOffers() {
    return TRIP_OFFERS;
  }

  // Метод для подсчета общей стоимости поездки
  getTotalPrice() {
    return this.tripEvents.reduce((sum, event) => sum + event.price, 0);
  }

  // Метод для получения маршрута и дат поездки
  getRouteInfo() {
    if (this.tripEvents.length === 0) {
      return { title: 'No destinations', dates: 'No dates' };
    }

    const sortedEvents = [...this.tripEvents].sort((a, b) => a.startTime - b.startTime);
    const startCity = sortedEvents[0].destination.name;
    const endCity = sortedEvents[sortedEvents.length - 1].destination.name;
    const title = `${startCity} — ${endCity}`;

    const startDate = sortedEvents[0].startTime.format('DD MMM');
    const endDate = sortedEvents[sortedEvents.length - 1].endTime.format('DD MMM');

    return { title, dates: `${startDate} — ${endDate}` };
  }
}
