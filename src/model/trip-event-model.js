import { destinations, offers } from '../mock/trip-event-mock.js';
import { getFilters } from '../utils.js';
import { adaptToClient } from '../adapters/event-adapter.js';

export default class TripEventModel {
  #tripEvents = [];
  #offers = offers;
  #onDataLoaded = null;

  setPoints(points) {
    this.#tripEvents = points.map(adaptToClient);
    this.#onDataLoaded?.();
  }

  updatePoint(update) {
    const index = this.#tripEvents.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error(`Can't update point with id ${update.id} — not found`);
    }

    this.#tripEvents = [
      ...this.#tripEvents.slice(0, index),
      update,
      ...this.#tripEvents.slice(index + 1)
    ];
  }

  setOnDataLoaded(callback) {
    this.#onDataLoaded = callback;
  }

  getPoints() {
    return this.#tripEvents;
  }

  getDestinations() {
    return destinations;
  }

  getDestinationById(id) {
    return destinations.find((destination) => destination.id === id);
  }

  getOffers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((group) => group.type === type)?.offers ?? [];
  }

  getTotalPrice() {
    return this.#tripEvents.reduce((sum, event) => {
      const selectedOffers = this.getOffersByType(event.type)
        .filter((offer) => event.offers.includes(offer.id));
      const offersTotal = selectedOffers.reduce((total, offer) => total + offer.price, 0);
      return sum + event.basePrice + offersTotal;
    }, 0);
  }

  getFilters(currentFilterType) {
    return getFilters(this.#tripEvents, currentFilterType);
  }
}
