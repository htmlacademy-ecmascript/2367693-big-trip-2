import { createElement } from '../render.js';
import { EventFormMode } from '../const.js';
import dayjs from 'dayjs';

// Генерация списка всех типов событий
function createEventTypeListTemplate(currentType, eventTypes = []) {
  return eventTypes.map((type) => {
    const lowerType = type.toLowerCase().replace(/\s+/g, '-');
    const isChecked = type === currentType;

    return `
      <div class="event__type-item">
        <input
          id="event-type-${lowerType}-1"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${type}"
          ${isChecked ? 'checked' : ''}
        >
        <label class="event__type-label event__type-label--${lowerType}" for="event-type-${lowerType}-1">
          ${type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      </div>
    `;
  }).join('');
}

// Генерация офферов
function createOffersTemplate(selectedOfferIds, allOffers) {
  if (!allOffers || allOffers.length === 0) {
    return '';
  }

  const selectedIds = selectedOfferIds.map(String);

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${allOffers.map((offer) => {
    const isChecked = selectedIds.includes(String(offer.id));
    return `
            <div class="event__offer-selector">
              <input
                class="event__offer-checkbox visually-hidden"
                id="event-offer-${offer.id}"
                type="checkbox"
                name="event-offer"
                ${isChecked ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.id}">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
              </label>
            </div>
          `;
  }).join('')}
      </div>
    </section>
  `;
}

// Генерация фото
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

// Генерация описания
function createDestinationTemplate(destination) {
  const hasDescription = Boolean(destination?.description);
  const hasPictures = Array.isArray(destination?.pictures) && destination.pictures.length > 0;

  if (!hasDescription && !hasPictures) {
    return '';
  }

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      ${hasDescription ? `<p class="event__destination-description">${destination.description}</p>` : ''}
      ${hasPictures ? createPhotosTemplate(destination.pictures) : ''}
    </section>
  `;
}

// Шаблон формы
function createEventFormTemplate(event, mode, eventTypes = []) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    offers = [],
    allOffers = [],
  } = event;

  const isEdit = mode === EventFormMode.EDIT;
  const formClass = isEdit ? 'event event--edit' : 'event event--new';
  const lowerType = type.toLowerCase().replace(/\s+/g, '-');
  const formattedStartTime = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const formattedEndTime = dayjs(dateTo).format('DD/MM/YY HH:mm');

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
              ${createEventTypeListTemplate(type, eventTypes)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">${type}</label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name || ''}" list="destination-list-1">
          <datalist id="destination-list-1"></datalist>
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
        ${createOffersTemplate(offers, allOffers)}
        ${createDestinationTemplate(destination)}
      </section>
    </form>
  `;
}

// Компонент
export default class EventFormView {
  constructor({ event, mode = EventFormMode.CREATE, eventTypes = [] }) {
    this.event = event;
    this.mode = mode;
    this.eventTypes = eventTypes;
    this.element = null;
  }

  getTemplate() {
    return createEventFormTemplate(this.event, this.mode, this.eventTypes);
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
