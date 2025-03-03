import { createElement } from '../render.js';

function createEventPointTemplate(event) {
  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${event.date}">${event.dateFormatted}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.title}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${event.startTime}">${event.startTimeFormatted}</time>
            &mdash;
            <time class="event__end-time" datetime="${event.endTime}">${event.endTimeFormatted}</time>
          </p>
          <p class="event__duration">${event.duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.price}</span>
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
