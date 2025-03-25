import { createElement } from '../render.js';
import { EventFormMode } from '../const.js';
import dayjs from 'dayjs';

// Функция для генерации списка типов событий
function createEventTypeListTemplate(currentType, availableTypes) {
  const normalizedCurrentType = currentType.toLowerCase();
  return availableTypes.map((type) => {
    const lowerType = type.toLowerCase().replace(/\s+/g, '-');
    const isChecked = (lowerType === normalizedCurrentType) ? 'checked' : '';

    return `
      <div class="event__type-item">
        <input
          id="event-type-${lowerType}-1"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${type}"
          ${isChecked}
        >
        <label class="event__type-label event__type-label--${lowerType}" for="event-type-${lowerType}-1">
          ${type}
        </label>
      </div>
    `;
  }).join('');
}

// Функция для генерации списка доступных предложений (offers)
function createOffersTemplate(offers) {
  if (!offers || offers.length === 0) {
    return '';
  }

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" ${offer.isSelected ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// Функция для рендеринга фотографий
function createPhotosTemplate(pictures) {
  if (!pictures || pictures.length === 0) {
    return '';
  }

  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((pic) => `
          <img class="event__photo" src="${pic.src}" alt="${pic.description}">
        `).join('')}
      </div>
    </div>
  `;
}

// Функция рендеринга шаблона формы
function createEventFormTemplate({ mode, type, offers, destination, dateFrom, dateTo, availableTypes, availableDestinations }) {
  const isEdit = mode === EventFormMode.EDIT;
  const formClass = isEdit ? 'event event--edit' : 'event event--new';
  const lowerType = type.toLowerCase().replace(/\s+/g, '-');

  const formattedStartTime = dateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : '';
  const formattedEndTime = dateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : '';

  return `
    <form class="${formClass}" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${lowerType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeListTemplate(type, availableTypes)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name || ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${availableDestinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <input class="event__input event__input--time" type="text" name="event-start-time" value="${formattedStartTime}">
          &mdash;
          <input class="event__input event__input--time" type="text" name="event-end-time" value="${formattedEndTime}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEdit ? 'Delete' : 'Cancel'}</button>
        ${isEdit ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
      </header>

      <section class="event__details">
        ${createOffersTemplate(offers)}
        ${createPhotosTemplate(destination?.pictures || [])}
      </section>
    </form>
  `;
}

export default class EventFormView {
  constructor({ mode = EventFormMode.CREATE, type = 'Flight', offers = [], destination = null, dateFrom = null, dateTo = null, availableTypes = [], availableDestinations = [] } = {}) {
    this.mode = mode;
    this.type = type;
    this.offers = offers;
    this.destination = destination;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.availableTypes = availableTypes;
    this.availableDestinations = availableDestinations;
    this.element = null;
  }

  getTemplate() {
    return createEventFormTemplate({
      mode: this.mode,
      type: this.type,
      offers: this.offers,
      destination: this.destination,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      availableTypes: this.availableTypes,
      availableDestinations: this.availableDestinations
    });
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
