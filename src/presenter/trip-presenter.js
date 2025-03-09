import TripFiltersView from '../view/trip-filters-view.js';
import SortView from '../view/sort-view.js';
import TripEventsView from '../view/trip-events-view.js';
import EventFormView from '../view/event-form-view.js';
import EventPointView from '../view/event-point-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripPresenter {
  constructor(container, tripEventModel) {
    this.container = container;
    this.tripEventModel = tripEventModel;
    this.tripEventsComponent = new TripEventsView();
  }

  init() {
    // Получаем данные из модели
    const tripEvents = this.tripEventModel.getTripEvents();
    const destinations = this.tripEventModel.getDestinations();

    // находим секцию .trip-events в index.html
    const tripEventsContainer = document.querySelector('.trip-events');

    if (!tripEventsContainer) {
      throw new Error('Container .trip-events not found in index.html');
    }

    // Рендерим список событий внутрь найденной секции
    render(this.tripEventsComponent, tripEventsContainer, RenderPosition.BEFOREEND);

    // Рендерим фильтры
    render(new TripFiltersView(), this.container, RenderPosition.BEFOREEND);

    // Рендерим сортировку
    render(new SortView(), tripEventsContainer, RenderPosition.AFTERBEGIN);

    // Контейнер для списка событий
    const eventsList = this.tripEventsComponent.getElement();

    // Рендерим форму редактирования первой в списке
    if (tripEvents.length > 0) {
      const eventFormItem = document.createElement('li');
      eventFormItem.classList.add('trip-events__item');
      eventFormItem.append(new EventFormView({ mode: 'edit' }).getElement());

      render(eventFormItem, eventsList, RenderPosition.AFTERBEGIN);
    }

    // Рендерим точки маршрута
    tripEvents.forEach((tripEvent) => {
      const destination = destinations.find((dest) => dest.id === tripEvent.destinationId);
      render(new EventPointView({ ...tripEvent, destination }), eventsList, RenderPosition.BEFOREEND);
    });
  }
}
