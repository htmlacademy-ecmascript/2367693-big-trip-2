import { createElement } from '../render.js';

const createTripInfoTemplate = (routeTitle, tripDates, totalPrice) => `
  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${routeTitle}</h1>
      <p class="trip-info__dates">${tripDates}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>
`;

export default class TripInfoView {
  constructor(routeTitle, tripDates, totalPrice) {
    this.routeTitle = routeTitle;
    this.tripDates = tripDates;
    this.totalPrice = totalPrice;
    this.element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this.routeTitle, this.tripDates, this.totalPrice);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
