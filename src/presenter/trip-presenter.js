import TripFiltersView from '../view/trip-filters-view.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripEventsView from '../view/trip-events-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { filterTypeToCallback, SortType, Filters } from '../const.js';
import PointPresenter from './point-presenter.js';
import dayjs from 'dayjs';

export default class TripPresenter {
  #tripEventModel = null;
  #tripMainElement = null;
  #tripEventsElement = null;
  #pointPresenters = new Map();
  #tripEventsListComponent = null;
  #currentSortType = SortType.DAY;
  #currentFilterType = Filters.EVERYTHING;
  #tripInfoComponent = null;

  constructor(tripEventModel, tripMainElement, tripEventsElement) {
    this.#tripEventModel = tripEventModel;
    this.#tripMainElement = tripMainElement;
    this.#tripEventsElement = tripEventsElement;
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleDataChange = (updatedPoint) => {
    this.#tripEventModel.updatePoint(updatedPoint);
    this.#clearPointList();
    this.#renderTrip();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };

  #handleFilterChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }

    this.#currentFilterType = filterType;
    this.#currentSortType = SortType.DAY;

    this.#clearPointList();
    this.#renderTrip();
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter?.destroy?.();
    });
    this.#pointPresenters.clear();
    this.#tripEventsListComponent.element.innerHTML = '';
  }

  #getSortedPoints(points) {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...points].sort((a, b) => {
          const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
          const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
          return durationB - durationA;
        });
      case SortType.PRICE:
        return [...points].sort((a, b) => b.basePrice - a.basePrice);
      case SortType.DAY:
      default:
        return [...points].sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
    }
  }

  #renderPointList() {
    const tripPoints = this.#tripEventModel.getPoints();
    const filteredPoints = tripPoints.filter(filterTypeToCallback[this.#currentFilterType]);
    const sortedPoints = this.#getSortedPoints(filteredPoints);
    const destinations = this.#tripEventModel.getDestinations();
    const offersByType = this.#tripEventModel.getOffers();

    for (const event of sortedPoints) {
      const pointPresenter = new PointPresenter(
        this.#tripEventsListComponent.element,
        destinations,
        offersByType,
        this.#handleDataChange,
        this.#handleModeChange
      );

      pointPresenter.init(event);
      this.#pointPresenters.set(event.id, pointPresenter);
    }
  }

  #renderTrip() {
    this.#tripEventsElement.innerHTML = '';

    const tripPoints = this.#tripEventModel.getPoints();
    const filteredPoints = tripPoints.filter(filterTypeToCallback[this.#currentFilterType]);

    if (filteredPoints.length === 0) {
      render(new NoPointsView(this.#currentFilterType), this.#tripEventsElement, RenderPosition.BEFOREEND);
      return;
    }

    const destinations = this.#tripEventModel.getDestinations();
    const totalPrice = this.#tripEventModel.getTotalPrice();

    if (this.#tripInfoComponent) {
      this.#tripInfoComponent.element.remove();
      this.#tripInfoComponent.removeElement();
    }

    this.#tripInfoComponent = new TripInfoView(filteredPoints, destinations, totalPrice);
    render(this.#tripInfoComponent, this.#tripMainElement, RenderPosition.AFTERBEGIN);

    render(
      new SortView({
        sortType: this.#currentSortType,
        onSortTypeChange: this.#handleSortTypeChange
      }),
      this.#tripEventsElement,
      RenderPosition.BEFOREEND
    );

    this.#tripEventsListComponent = new TripEventsView();
    render(this.#tripEventsListComponent, this.#tripEventsElement, RenderPosition.BEFOREEND);

    this.#renderPointList();
  }

  init() {
    const tripControlsElement = document.querySelector('.trip-controls__filters');
    tripControlsElement.innerHTML = '';

    const filters = this.#tripEventModel.getFilters(this.#currentFilterType);
    render(
      new TripFiltersView(filters, this.#handleFilterChange),
      tripControlsElement,
      RenderPosition.BEFOREEND
    );

    this.#renderTrip();
  }
}
