import { createElement } from '../render.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

// Функция вычисления продолжительности события
function calculateEventDuration(dateFrom, dateTo) {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  if (diff < 60) {
    return `${diff}M`;
  } else if (diff < 1440) {
    return `${Math.floor(diff / 60)}H ${diff % 60}M`;
  } else {
    const days = Math.floor(diff / 1440);
    const hours = Math.floor((diff % 1440) / 60);
    const minutes = diff % 60;
    return `${days}D ${hours}H ${minutes}M`;
  }
}

// Функция генерации шаблона точки маршрута
function createEventPointTemplate(point) {
  const { type, destination, dateFrom, dateTo, basePrice, offers, isFavorite } = point;
  const eventDate = dayjs(dateFrom).format('MMM D');
  const startTimeFormatted = dayjs(dateFrom).format('HH:mm');
  const endTimeFormatted = dayjs(dateTo).format('HH:mm');
  const durationFormatted = calculateEventDuration(dateFrom, dateTo);

  // Проверяем, есть ли офферы перед рендерингом
  const offersTemplate = Array.isArray(offers) && offers.length > 0
    ? `<ul class="event__selected-offers">
        ${offers.filter((offer) => offer.isSelected).map((offer) => `
            <li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </li>
          `).join('')}
      </ul>`
    : ''; // Если офферов нет, не рендерим блок

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>

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

        ${offersTemplate} <!-- ✅ Теперь блок рендерится только если есть офферы -->

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
  constructor(point) {
    this.element = null;
    this.point = point;
  }

  getTemplate() {
    return createEventPointTemplate(this.point);
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
