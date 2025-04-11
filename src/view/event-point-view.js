import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

function calculateEventDuration(dateFrom, dateTo) {
  const diffInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const dur = dayjs.duration(diffInMinutes, 'minutes');

  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();

  return `${days > 0 ? `${days}D ` : ''}${hours > 0 ? `${hours}H ` : ''}${minutes}M`;
}

function createEventPointTemplate(point, destinations) {
  const { type, destination, dateFrom, dateTo, basePrice, offers, isFavorite } = point;
  const destinationObj = destinations.find((d) => d.id === destination);

  const eventDate = dayjs(dateFrom).format('MMM D');
  const startTimeFormatted = dayjs(dateFrom).format('HH:mm');
  const endTimeFormatted = dayjs(dateTo).format('HH:mm');
  const durationFormatted = calculateEventDuration(dateFrom, dateTo);

  const offersTemplate = Array.isArray(offers) && offers.length > 0
    ? `<ul class="event__selected-offers">
        ${offers.filter((offer) => offer.isSelected).map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </li>
        `).join('')}
      </ul>`
    : '';

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationObj?.name || ''}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startTimeFormatted}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endTimeFormatted}</time>
          </p>
          <p class="event__duration">${durationFormatted}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
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

export default class EventPointView extends AbstractView {
  #point;
  #destinations;
  #onEditClick;

  constructor(point, destinations) {
    super();
    this.#point = point;
    this.#destinations = destinations;
  }

  get template() {
    return createEventPointTemplate(this.#point, this.#destinations);
  }

  setEditClickHandler(callback) {
    this.#onEditClick = callback;
    const button = this.element.querySelector('.event__rollup-btn');
    if (button) {
      button.addEventListener('click', this.#editClickHandler);
    }
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };
}
