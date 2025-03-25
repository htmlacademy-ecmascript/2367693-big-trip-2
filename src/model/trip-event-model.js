import dayjs from 'dayjs';
import { destinations, offers } from '../mock/trip-event-mock.js';

export default class TripEventModel {
  constructor() {
    this.tripEvents = [];
    this._onDataLoaded = null; // обработка загрузки данных
  }

  setPoints(points) {
    this.tripEvents = points.map((event) => ({
      ...event,
      destination: this.getDestinationById(event.destination),
      offers: this.getOffersByType(event.type).filter((offer) => event.offers.includes(offer.id)),
      isFavorite: event.isFavorite ?? false,
      basePrice: event.basePrice,
      dateFrom: dayjs(event.dateFrom).isValid() ? dayjs(event.dateFrom) : dayjs(),
      dateTo: dayjs(event.dateTo).isValid() ? dayjs(event.dateTo) : dayjs(),
    }));

    if (this._onDataLoaded) {
      this._onDataLoaded();
    }
  }

  setOnDataLoaded(callback) {
    this._onDataLoaded = callback;
  }

  getPoints() {
    return this.tripEvents;
  }

  getDestinationById(id) {
    return destinations.find((destination) => destination.id === String(id)) || { name: 'Unknown', pictures: [] };
  }

  getOffersByType(type) {
    const offerCategory = offers.find((offerGroup) => offerGroup.type === type);
    return offerCategory ? offerCategory.offers : [];
  }

  getTotalPrice() {
    return this.tripEvents.reduce((sum, event) => {
      const offersTotal = event.offers.reduce((total, offer) => total + offer.price, 0);
      return sum + event.basePrice + offersTotal;
    }, 0);
  }

  // список всех доступных типов событий
  getOfferTypes() {
    return offers.map((group) => group.type);
  }
}
