import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { calculateEventDuration } from '../utils.js';

function createEventPointTemplate(point, destinations, offersByType) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offers = [],
    isFavorite
  } = point;

  const iconName = typeof type === 'string' ? type.toLowerCase() : 'default';
  const destinationObj = destinations.find((d) => d.id === destination);
  const availableOffers = offersByType.find((group) => group.type === type)?.offers || [];
  const selectedOffers = availableOffers.filter((offer) => offers.includes(offer.id));

  const eventDate = dayjs(dateFrom).format('MMM D');
  const startTimeFormatted = dayjs(dateFrom).format('HH:mm');
  const endTimeFormatted = dayjs(dateTo).format('HH:mm');
  const durationFormatted = calculateEventDuration(dateFrom, dateTo);

  const offersTemplate = selectedOffers.length > 0
    ? `<ul class="event__selected-offers">
        ${selectedOffers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </li>
        `).join('')}
      </ul>`
    : '<!-- no offers -->';

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${iconName}.png" alt="Event type icon">
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
  #offersByType;
  #onEditClick;
  #onFavoriteClick;

  constructor(point, destinations, offersByType) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  get template() {
    return createEventPointTemplate(this.#point, this.#destinations, this.#offersByType);
  }

  setEditClickHandler(callback) {
    this.#onEditClick = callback;
    const button = this.element.querySelector('.event__rollup-btn');
    if (button) {
      button.addEventListener('click', this.#editClickHandler);
    }
  }

  setFavoriteClickHandler(callback) {
    this.#onFavoriteClick = callback;
    const favoriteButton = this.element.querySelector('.event__favorite-btn');
    if (favoriteButton) {
      favoriteButton.addEventListener('click', this.#favoriteClickHandler);
    }
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
