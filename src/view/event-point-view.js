import { createElement } from '../render.js';

function createEventPointTemplate(event) {
  return `
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.eventType} ${event.destination ? event.destination.name : 'Unknown'}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${event.startTime}">${event.startTime.replace('T', ' ')}</time>
            &mdash;
            <time class="event__end-time" datetime="${event.endTime}">${event.endTime.replace('T', ' ')}</time>
          </p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${event.price}</span>
        </p>
      </div>
    </li>
  `;
}

export default class EventPointView {
  constructor(event) {
    this.event = event;
  }

  getTemplate() {
    return createEventPointTemplate(this.event);
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
