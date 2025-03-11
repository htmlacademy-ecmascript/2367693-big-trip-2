import { createElement } from '../render.js';

const createTripInfoTemplate = (route, dates, totalCost) => `
  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>
      <p class="trip-info__dates">${dates}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  </section>
`;

export default class TripInfoView {
  constructor(route, dates, totalCost) {
    this.route = route;
    this.dates = dates;
    this.totalCost = totalCost;
    this.element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this.route, this.dates, this.totalCost);
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
