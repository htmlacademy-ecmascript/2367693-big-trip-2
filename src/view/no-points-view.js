import AbstractView from '../framework/view/abstract-view.js';

/**
 * Тексты заглушек по типам фильтра
 */
const NoPointsText = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now',
};

/**
 * Генератор шаблона заглушки
 * @param {string} filterType
 * @returns {string}
 */
function createNoPointsTemplate(filterType) {
  const message = NoPointsText[filterType] || NoPointsText.everything;

  return `<p class="trip-events__msg">${message}</p>`;
}

export default class NoPointsView extends AbstractView {
  #filterType;

  /**
   * @param {string} filterType — тип активного фильтра (everything, future, present, past)
   */
  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
