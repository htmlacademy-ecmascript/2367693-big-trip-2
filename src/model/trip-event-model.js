import { destinations, offers } from '../mock/trip-event-mock.js';
import { getFilters } from '../utils.js';

export default class TripEventModel {
  constructor() {
    this.tripEvents = [];
    this.offers = offers;
    this._onDataLoaded = null; // обработка загрузки данных
  }

  /**
   * Сохраняет точки маршрута
   * @param {Array} points - массив точек маршрута
   */
  setPoints(points) {
    this.tripEvents = points;

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
    return destinations.find((destination) => destination.id === id);
  }

  getDestinations() {
    return destinations;
  }

  getTotalPrice() {
    return this.tripEvents.reduce((sum, event) => {
      const allOffers = this.getOffersByType(event.type);
      const selectedOffers = allOffers.filter((offer) => event.offers.includes(offer.id));
      const offersTotal = selectedOffers.reduce((total, offer) => total + offer.price, 0);
      return sum + event.basePrice + offersTotal;
    }, 0);
  }

  getOffers() {
    return this.offers;
  }

  getOffersByType(type) {
    const foundGroup = this.offers.find((group) => group.type === type);
    return foundGroup ? foundGroup.offers : [];
  }

  /**
   * Возвращает массив фильтров с флагами активности
   * @param {string} currentFilterType - активный фильтр
   * @returns {Array}
   */
  getFilters(currentFilterType) {
    return getFilters(this.getPoints(), currentFilterType);
  }
}
