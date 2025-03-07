import TripFiltersView from '../view/trip-filters-view.js';
import SortView from '../view/sort-view.js';
import EventFormView from '../view/event-form-view.js';
import EventPointView from '../view/event-point-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripPresenter {
  constructor(container, tripEventModel) {
    this.container = container;
    this.tripEventModel = tripEventModel;
  }

  init() {
    // Получаем данные из модели
    const tripEvents = this.tripEventModel.getTripEvents();
    const destinations = this.tripEventModel.getDestinations();

    // Рендерим фильтры
    render(new TripFiltersView(), this.container, RenderPosition.BEFOREEND);

    // Рендерим сортировку
    render(new SortView(), this.container, RenderPosition.BEFOREEND);

    // Контейнер для списка событий
    const eventsList = document.createElement('ul');
    eventsList.classList.add('trip-events__list');
    this.container.appendChild(eventsList);

    // Рендерим форму редактирования первой в списке
    if (tripEvents.length > 0) {
      render(new EventFormView({ mode: 'edit' }), eventsList, RenderPosition.AFTERBEGIN);
    }

    // Рендерим точки маршрута
    tripEvents.forEach((tripEvent) => {
      const destination = destinations.find((dest) => dest.id === tripEvent.destinationId);
      render(new EventPointView({ ...tripEvent, destination }), eventsList, RenderPosition.BEFOREEND);
    });
  }
}
