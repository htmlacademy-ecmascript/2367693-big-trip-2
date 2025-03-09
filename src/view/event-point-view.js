import { createElement } from '../render.js';
import dayjs from 'dayjs';

function createEventPointTemplate(event) {
  const { eventType, destination, startTime, endTime, price } = event;

  // Форматирование даты и времени
  const eventDate = dayjs(startTime).format('MMM D');
  const startTimeFormatted = dayjs(startTime).format('HH:mm');
  const endTimeFormatted = dayjs(endTime).format('HH:mm');

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startTime}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventType} ${destination?.name || 'Unknown'}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTime}">${startTimeFormatted}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTime}">${endTimeFormatted}</time>
          </p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${price ?? 0}</span>
        </p>
      </div>
    </li>
  `;
}

export default class EventPointView {
  constructor(event) {
    this.event = event;
    this.element = null;
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
