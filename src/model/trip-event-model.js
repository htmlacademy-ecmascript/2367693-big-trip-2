import { destinations, offers } from '../mock/trip-event-mock.js';
import { getFilters } from '../utils.js';

export default class TripEventModel {
  #tripEvents = [];
  #offers = offers;
  #onDataLoaded = null;

  setPoints(points) {
    this.#tripEvents = points.map(this.#adaptToClient);
    this.#onDataLoaded?.();
  }

  updatePoint(update) {
    const index = this.#tripEvents.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error(`Can't update point with id ${update.id} — not found`);
    }

    const existing = this.#tripEvents[index];

    const adapted = this.#adaptToClient({
      ...existing,
      ...update,
      // гарантия, что если offers не передан — оставим прежние
      offers: update.offers ?? existing.offers
    });

    this.#tripEvents = [
      ...this.#tripEvents.slice(0, index),
      adapted,
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

  #adaptToClient(point) {
    return {
      ...point,
      type: point.type ?? '',
      destination: point.destination ?? '',
      basePrice: point.basePrice ?? 0,
      dateFrom: point.dateFrom ?? new Date().toISOString(),
      dateTo: point.dateTo ?? new Date().toISOString(),
      isFavorite: point.isFavorite ?? false,
      offers: (point.offers ?? []).map((offer) =>
        typeof offer === 'object' ? offer.id : offer
      )
    };
  }
}
