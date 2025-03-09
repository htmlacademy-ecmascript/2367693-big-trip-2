import { createElement } from '../render.js';
import { EventFormMode, TRIP_EVENT_TYPES } from '../const.js';

function createEventTypeListTemplate() {
  return TRIP_EVENT_TYPES.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>
  `).join('');
}

function createEventFormTemplate({ mode }) {
  const isEdit = mode === EventFormMode.EDIT;
  const formClass = isEdit ? 'event event--edit' : 'event event--new';

  return `
    <form class="${formClass}" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeListTemplate()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            Flight
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${isEdit ? 'Geneva' : ''}" list="destination-list-1">
        </div>

        <div class="event__field-group event__field-group--time">
          <input class="event__input event__input--time" type="text" name="event-start-time" value="${isEdit ? '19/03/19 00:00' : ''}">
          &mdash;
          <input class="event__input event__input--time" type="text" name="event-end-time" value="${isEdit ? '19/03/19 00:00' : ''}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEdit ? 'Delete' : 'Cancel'}</button>
        ${isEdit ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
      </header>
    </form>
  `;
}

export default class EventFormView {
  constructor({ mode = EventFormMode.CREATE } = {}) {
    this.mode = mode;
  }

  getTemplate() {
    return createEventFormTemplate({ mode: this.mode });
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
