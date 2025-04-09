import AbstractView from '../framework/view/abstract-view.js';

/**
 * Создаёт шаблон одного фильтра
 * @param {Object} filter
 * @param {string} filter.type
 * @param {string} filter.name
 * @param {boolean} filter.isDisabled
 * @param {boolean} filter.isChecked
 * @returns {string}
 */
function createFilterItemTemplate({ type, name, isDisabled, isChecked }) {
  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>
  `;
}

/**
 * Создаёт шаблон формы фильтров
 * @param {Array} filters
 * @returns {string}
 */
function createFiltersTemplate(filters) {
  const filtersMarkup = filters.map(createFilterItemTemplate).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class TripFiltersView extends AbstractView {
  #filters;

  /**
   * @param {Array} filters - массив объектов фильтра
   */
  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
