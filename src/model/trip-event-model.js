import { TRIP_DESTINATIONS, TRIP_OFFERS } from '../const.js';
import { generateTripEvents } from '../mock/trip-event-mock.js';

export default class TripEventModel {
  constructor() {
    this.tripEvents = generateTripEvents().map((event) => ({
      ...event,
      offers: TRIP_OFFERS[event.eventType] || [],
    }));
    this.destinations = TRIP_DESTINATIONS;
    this.offers = TRIP_OFFERS;
  }

  getTripEvents() {
    return this.tripEvents;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
