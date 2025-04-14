import AbstractView from '../framework/view/abstract-view.js';

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
  #onFilterChange;

  constructor(filters, onFilterChange) {
    super();
    this.#filters = filters;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#handleFilterChange);
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }

  #handleFilterChange = (evt) => {
    if (evt.target.name === 'trip-filter') {
      this.#onFilterChange?.(evt.target.value);
    }
  };
}
