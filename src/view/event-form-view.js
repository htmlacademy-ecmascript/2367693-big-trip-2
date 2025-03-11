import { createElement } from '../render.js';
import { EventFormMode, TRIP_EVENT_TYPES } from '../const.js';

// Функция, формирующая список радиокнопок по массиву TRIP_EVENT_TYPES.
// currentType — строка, соответствующая выбранному типу события.
function createEventTypeListTemplate(currentType) {
  return TRIP_EVENT_TYPES.map((type) => {
    // Отметим radio как checked, если оно совпадает с текущим типом.
    const isChecked = (type === currentType) ? 'checked' : '';

    const lowerType = type.toLowerCase().replace(/\s+/g, '-');

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
        <label
          class="event__type-label event__type-label--${lowerType}"
          for="event-type-${lowerType}-1"
        >
          ${type}
        </label>
      </div>
    `;
  }).join('');
}

// Функция рендеринга офферов (дополнительных опций)
function createOffersTemplate(offers) {
  if (!offers || offers.length === 0) {
    return '';
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${offer.id}"
              type="checkbox"
              name="event-offer"
              ${offer.isSelected ? 'checked' : ''}
            >
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

// Функция рендеринга описания и фотографий для пункта назначения
function createDestinationTemplate(destination) {
  if (!destination || !destination.description) {
    return '';
  }

  // Гарантируем, что destination.pictures - массив объектов
  const pictures = Array.isArray(destination.pictures)
    ? destination.pictures.map((pic) => (typeof pic === 'string' ? { src: pic, description: 'Generated photo' } : pic))
    : [];

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${ pictures.length > 0 ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${pictures.map((pic) => `
                <img
                  class="event__photo"
                  src="${pic.src}"
                  alt="${pic.description || 'Event photo'}"
                >
              `).join('')}
            </div>
          </div>
        ` : '<p class="event__no-photos">No photos available</p>' }
    </section>
  `;
}

/**
 * Генерируем шаблон формы (создания или редактирования).
 * Параметры:
 *  - mode: режим формы (EventFormMode.EDIT или EventFormMode.CREATE)
 *  - type: текущий тип события (например, 'Flight')
 *  - offers: список офферов для данного типа
 *  - destination: объект данных о пункте назначения
 */
function createEventFormTemplate({
  mode,
  type = 'Flight',
  offers = [],
  destination = null
}) {
  const isEdit = mode === EventFormMode.EDIT;
  const formClass = isEdit ? 'event event--edit' : 'event event--new';

  // Преобразуем название типа к нижнему регистру, чтобы подставить в src для иконки
  const lowerType = type.toLowerCase().replace(/\s+/g, '-');

  return `
    <form class="${formClass}" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img
              class="event__type-icon"
              width="17"
              height="17"
              src="img/icons/${lowerType}.png"
              alt="Event type icon"
            >
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeListTemplate(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input
            class="event__input event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${destination?.name || ''}"
            list="destination-list-1"
          >
        </div>

        <div class="event__field-group event__field-group--time">
          <input
            class="event__input event__input--time"
            type="text"
            name="event-start-time"
            value="${isEdit ? '19/03/19 00:00' : ''}"
          >
          &mdash;
          <input
            class="event__input event__input--time"
            type="text"
            name="event-end-time"
            value="${isEdit ? '19/03/19 00:00' : ''}"
          >
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEdit ? 'Delete' : 'Cancel'}</button>
        ${ isEdit ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : '' }
      </header>

      <!-- Блок офферов (дополнительных опций) -->
      ${createOffersTemplate(offers)}

      <!-- Блок информации о пункте назначения -->
      ${createDestinationTemplate(destination)}
    </form>
  `;
}

export default class EventFormView {
  constructor({
    mode = EventFormMode.CREATE,
    type = 'Flight',
    offers = [],
    destination = null
  } = {}) {
    this.mode = mode;
    this.type = type;
    this.offers = offers;
    this.destination = destination;
    this.element = null;
  }

  getTemplate() {
    return createEventFormTemplate({
      mode: this.mode,
      type: this.type,
      offers: this.offers,
      destination: this.destination
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
