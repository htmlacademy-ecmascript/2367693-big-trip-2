import { destinations, offers } from '../mock/trip-event-mock.js';
import { getFilters } from '../utils.js';

export default class TripEventModel {
  constructor() {
    this.tripEvents = [];
    this.offers = offers;
    this._onDataLoaded = null;
  }

  setPoints(points) {
    this.tripEvents = points;

    if (this._onDataLoaded) {
      this._onDataLoaded();
    }
  }

  updatePoint(updatedPoint) {
    // 🧠 Преобразуем offers к id[], если нужно (страховка)
    const normalizedOffers = Array.isArray(updatedPoint.offers)
      ? updatedPoint.offers.map((offer) =>
        typeof offer === 'object' && offer !== null ? offer.id : offer
      )
      : [];

    this.tripEvents = this.tripEvents.map((point) =>
      point.id === updatedPoint.id
        ? { ...updatedPoint, offers: normalizedOffers }
        : point
    );
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

  getFilters(currentFilterType) {
    return getFilters(this.getPoints(), currentFilterType);
  }
}
