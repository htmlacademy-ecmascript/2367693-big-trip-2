import { createElement } from '../render.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

function calculateEventDuration(startTime, endTime) {
  const diff = dayjs(endTime).diff(dayjs(startTime), 'minute');
  return dayjs.duration(diff, 'minutes').format('H[H] mm[M]');
}

function createEventPointTemplate(event) {
  const { eventType, destination, startTime, endTime, price, offers, isFavorite } = event;

  const eventDate = dayjs(startTime).format('MMM D');
  const startTimeFormatted = dayjs(startTime).format('HH:mm');
  const endTimeFormatted = dayjs(endTime).format('HH:mm');
  const durationFormatted = calculateEventDuration(startTime, endTime);

  const offersTemplate = (offers && offers.length)
    ? `<ul class="event__selected-offers">
        ${offers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            +€${offer.price}
          </li>
        `).join('')}
      </ul>`
    : '';

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

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
          <p class="event__duration">${durationFormatted}</p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${price ?? 0}</span>
        </p>

        ${offersTemplate}

        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </button>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
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
