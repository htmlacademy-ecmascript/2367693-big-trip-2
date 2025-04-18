import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EventFormMode } from '../const.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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
          ${isChecked ? 'checked' : ''}>
        <label class="event__type-label event__type-label--${lowerType}" for="event-type-${lowerType}-1">
          ${type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      </div>
    `;
  }).join('');
}

function createDestinationOptionsTemplate(destinations = []) {
  return destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
}

function createOffersTemplate(selectedOfferIds, allOffers = []) {
  if (!allOffers.length) {
    return '';
  }

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${allOffers.map((offer) => {
    const isChecked = selectedOfferIds.includes(offer.id);
    return `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden"
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

function createPhotosTemplate(pictures) {
  if (!pictures?.length) {
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

function createDestinationTemplate(destination) {
  if (!destination || (!destination.description && (!destination.pictures?.length))) {
    return '';
  }

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description || ''}</p>
      ${createPhotosTemplate(destination.pictures)}
    </section>
  `;
}

function createEventFormTemplate(event, mode, offersByType = [], destinations = []) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    offers: selectedOfferIds = [],
  } = event;

  const isEdit = mode === EventFormMode.EDIT;
  const formClass = isEdit ? 'event event--edit' : 'event event--new';
  const lowerType = type.toLowerCase().replace(/\s+/g, '-');
  const formattedStartTime = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const formattedEndTime = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const currentOffers = offersByType.find((group) => group.type === type)?.offers || [];
  const eventTypes = offersByType.map((group) => group.type);
  const destinationObj = destinations.find((d) => d.id === destination);

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
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationObj?.name || ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationOptionsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group event__field-group--time">
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedStartTime}">
          &mdash;
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedEndTime}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEdit ? 'Delete' : 'Cancel'}</button>
        ${isEdit ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
      </header>

      <section class="event__details">
        ${createOffersTemplate(selectedOfferIds, currentOffers)}
        ${createDestinationTemplate(destinationObj)}
      </section>
    </form>
  `;
}

export default class EventFormView extends AbstractStatefulView {
  #mode;
  #offersByType;
  #destinations;

  #handleFormSubmit = null;
  #handleFormReset = null;
  #handleCloseClick = null;

  #dateFromPicker = null;
  #dateToPicker = null;

  constructor({ event, mode = EventFormMode.CREATE, offers = [], destinations = [], onFormSubmit }) {
    super();
    this._state = {
      ...structuredClone(event),
      id: event.id
    };
    this.#mode = mode;
    this.#offersByType = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
  }

  get template() {
    return createEventFormTemplate(this._state, this.#mode, this.#offersByType, this.#destinations);
  }

  _restoreHandlers() {
    this.element?.querySelectorAll('.event__type-input')
      .forEach((input) => input.addEventListener('change', this.#typeChangeHandler));

    this.element?.querySelector('.event__input--destination')
      ?.addEventListener('change', this.#destinationChangeHandler);

    this.element?.addEventListener('submit', this.#formSubmitHandler);

    if (this.#handleFormReset) {
      this.setFormResetHandler(this.#handleFormReset);
    }

    if (this.#handleCloseClick) {
      this.setCloseClickHandler(this.#handleCloseClick);
    }

    this.#setDatePickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EventFormView.parseStateToPoint(this._state));
  };

  #setDatePickers() {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      }
    );
  }

  #removeDatePickers() {
    this.#dateFromPicker?.destroy();
    this.#dateFromPicker = null;

    this.#dateToPicker?.destroy();
    this.#dateToPicker = null;
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({ dateFrom: userDate.toISOString() });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({ dateTo: userDate.toISOString() });
  };

  removeElement() {
    this.#removeDatePickers();
    super.removeElement();
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({ type: evt.target.value, offers: [] });
  };

  #destinationChangeHandler = (evt) => {
    const destination = this.#destinations.find((dest) => dest.name === evt.target.value);
    this.updateElement({ destination: destination?.id || null });
  };

  setCloseClickHandler(callback) {
    this.#handleCloseClick = callback;
    const button = this.element.querySelector('.event__rollup-btn');
    if (button) {
      button.addEventListener('click', callback);
    }
  }

  setFormResetHandler(callback) {
    this.#handleFormReset = callback;
    const reset = this.element.querySelector('.event__reset-btn');
    if (reset) {
      reset.addEventListener('click', callback);
    }
  }

  static parsePointToState(point) {
    return structuredClone(point);
  }

  static parseStateToPoint(state) {
    return structuredClone(state);
  }
}
